// import { isNotNull, ne } from "drizzle-orm";

import { integrationSchema } from "#imports";
import { InsertIntegration } from "~/server/schema/admin";

interface listIntegrationQuery {
  q?: string
}

const db = useDrizzle();
// const cache = useStorage("redis");

// const getCacheBotKey = (botId: string) => `chatbot:${botId}`;

export const createIntegration = async (integration: InsertIntegration) =>
  (await db.insert(integrationSchema).values(integration).returning())[0];

export const listIntegrations = async (organizationId: string, query: listIntegrationQuery) => {
  let filters: any = [eq(integrationSchema.org_id, organizationId)];

  if(query?.q) {
    if(query?.q === "channel") {
       filters.push(eq(integrationSchema.crm, "whatsapp"))
    } else {
      filters.push(ne(integrationSchema.crm, "whatsapp"))
    }
  }

  const data = await db.query.integrationSchema.findMany({
    where: and(...filters),
    orderBy: [desc(integrationSchema.createdAt)],
  });
  return data;
};

export const findIntegrationDetails = async (
  organizationId: string,
  id: string,
) => {
  const data = await db.query.integrationSchema.findFirst({
    where: eq(integrationSchema.id, id),
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
    ),
  ];

  const data = await db.query.integrationSchema.findFirst({
    where: and(...filters),
    orderBy: [desc(integrationSchema.createdAt)],
  });
  return data;
};
export const updateIntegrationById = async (id: string, metadata: any) =>
  (
    await db
      .update(integrationSchema)
      .set({ metadata })
      .where(eq(integrationSchema.id, id))
      .returning()
  )[0];

export const deleteIntegration = async (integrationId: string) => {
  //   cache.removeItem(getCacheBotKey(botId));
  return (
    await db
      .delete(integrationSchema)
      .where(eq(integrationSchema.id, integrationId))
      .returning()
  )[0];
};
