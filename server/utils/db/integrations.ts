// import { isNotNull, ne } from "drizzle-orm";

import { integrationSchema } from "#imports";

interface listIntegrationQuery {
  q?: string;
  crm?: string;
  type?: string;
  page?: string;
  limit?: string;
  integrationName?: string,
  isVerified: string
}

const db = useDrizzle();
// const cache = useStorage("redis");

// const getCacheBotKey = (botId: string) => `chatbot:${botId}`;

export const createIntegration = async (integration: InsertIntegration) =>
  (await db.insert(integrationSchema).values(integration).returning())[0];

export const listIntegrations = async (
  organizationId: string,
  query: listIntegrationQuery,
) => {
  let filters: any = [eq(integrationSchema.org_id, organizationId), eq(integrationSchema.isDeleted, false)];

  if (query?.q) {
    if (query?.q === "channel") {
      filters.push(eq(integrationSchema.type, "whatsapp"));
    } else {
      filters.push(eq(integrationSchema.type, query?.q))
    }
  }

  if(query?.integrationName) {
    filters.push(ilike(integrationSchema.name, `%${query.integrationName}%`));
  }

  if (query?.crm) {
    filters.push(eq(integrationSchema.crm, query?.crm));
  }
  
  if (query?.type) {
    filters.push(eq(integrationSchema.type, query?.type));
  }

  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let data = await db.query.integrationSchema.findMany({
    where: and(...filters),
    orderBy: [desc(integrationSchema.createdAt)],
  });

  if (query?.isVerified === "true") {
    data = data.filter((integration) => {
      const status = integration?.metadata?.status;
      return typeof status === "string" && status.toLowerCase() === "verified";
    });
  }

  if (query?.page && query?.limit) {
    const paginatedIntegrations = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedIntegrations,
    };
  } else {
    return data;
  }
};

export const getIntegrationById = async (
  organizationId: string,
  integrationId: string,
) => {
  const data = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.org_id, organizationId),
      eq(integrationSchema.id, integrationId),
      eq(integrationSchema.isDeleted, false)
    ),
  });
  return data;
};

export const findIntegrationDetails = async (
  organizationId: string,
  id: string,
) => {
  const data = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.id, id),
      eq(integrationSchema.isDeleted, false)
    )
  });
  return data;
};
export const listLastCreatedIntegrationByCRM = async (
  organizationId: string,
  crm: string,
) => {
  let filters: any = [
    and(
      eq(integrationSchema.org_id, organizationId),
      eq(integrationSchema.crm, crm),
      eq(integrationSchema.isDeleted, false)
    ),
  ];

  const data = await db.query.integrationSchema.findFirst({
    where: and(...filters),
    orderBy: [desc(integrationSchema.createdAt)],
  });
  return data;
};
export const updateIntegrationById = async (id: string, integration: any) => {
  const data = await db
    .update(integrationSchema)
    .set({
      ...integration,
      updatedAt: new Date(),
    })
    .where(eq(integrationSchema.id, id))
    .returning();

  return data[0];
};

export const deleteIntegration = async (integrationId: string) => {
  //   cache.removeItem(getCacheBotKey(botId));
  return (
    await db
      .delete(integrationSchema)
      .where(eq(integrationSchema.id, integrationId))
      .returning()
  )[0];
};

export const getAllWhatsappIntegration = async() => {
  return await db.query.integrationSchema.findMany({
    where: and(
      eq(integrationSchema.crm, "whatsapp"),
      eq(integrationSchema.type, "whatsapp"),
      eq(integrationSchema.isDeleted, false)
    )
  })
}

export const getOrgWhatsappIntegration = async (orgId: string) => {
  return await db.query.integrationSchema.findMany({
    where: and(
      eq(integrationSchema.type, "whatsapp"),
      eq(integrationSchema.crm, "whatsapp"),
      eq(integrationSchema.org_id, orgId),
      eq(integrationSchema.isDeleted, false)
    )
  })
}

export const getIntegrationDetails = async (integrationId: string) => {
  const data = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.id, integrationId),
      eq(integrationSchema.isDeleted, false)
    )
  });
  return data;
}

export const checkIntegrationNameAlreadyExists = async (organizationId: string, integrationName: string, mode: string, id?: string) => {
  return await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.org_id, organizationId),
      ilike(integrationSchema.name, integrationName),
      eq(integrationSchema.isDeleted, false),
      (mode === "update" ? ne(integrationSchema.id, id) : undefined),
    )
  })
}

export const getChatVoiceIntegrationByIntegrationId = async (integrationId: string) => {
  const data = await db.query.botIntegrationSchema.findFirst({
    where: and(eq(botIntegrationSchema.integrationId, integrationId)),
    with: { integration: true },
  });
  if(!data) {
    return await db.query.voicebotIntegrationSchema.findFirst({
      where: and(eq(voicebotIntegrationSchema.integrationId, integrationId)),
      with: { integration: true },
    });
  }
  return data;
}