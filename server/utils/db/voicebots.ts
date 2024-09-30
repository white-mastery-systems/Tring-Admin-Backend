import momentTz from "moment-timezone";

const db = useDrizzle();

interface listVoicebotQuery {
  active?: string;
  q?: string;
  page?: string;
  limit?: string;
}

export const createVoicebot = async (voicebot: InsertVoiceBot) => {
  return (await db.insert(voicebotSchema).values(voicebot).returning())[0];
};

export const listVoicebots = async (
  organizationId: string,
  query: listVoicebotQuery,
  timeZone: string,
) => {
  let filters: any = [eq(voicebotSchema.organizationId, organizationId)];

  if (query?.active === "true") {
    filters.push(eq(voicebotSchema.active, true));
  } else if (query?.active === "false") {
    filters.push(eq(voicebotSchema.active, false));
  }
  if (query?.q) {
    filters.push(ilike(voicebotSchema.name, `%${query.q}%`));
  }
  let page,
    offset,
    limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let data = await db.query.voicebotSchema.findMany({
    where: and(...filters),
    orderBy: [desc(voicebotSchema.createdAt)],
  });
  data = data.map((i: any) => ({
    ...i,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  if (query?.page && query?.limit) {
    const paginatedVoiceBots = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedVoiceBots,
    };
  } else {
    return data;
  }

  return data;
};

export const getVoicebot = async (voicebotId: string) => {
 const data = await db.query.voicebotSchema.findFirst({
    where: eq(voicebotSchema.id, voicebotId),
  });
  return data;
}

export const getVoicebotById = async (
  organizationId: string,
  voicebotId: string,
) => {
  const data = await db.query.voicebotSchema.findFirst({
    where: and(
      eq(voicebotSchema.organizationId, organizationId),
      eq(voicebotSchema.id, voicebotId),
    ),
  });
  return data;
};

export const updateVoiceBot = async (
  voicebotId: string,
  voicebot: InsertVoiceBot,
) => {
  return (
    await db
      .update(voicebotSchema)
      .set({
        ...voicebot,
        updatedAt: new Date(),
      })
      .where(eq(voicebotSchema.id, voicebotId))
      .returning()
  )[0];
};

export const deleteVoiceBot = async (voicebotId: string) => {
  return (
    await db
      .delete(voicebotSchema)
      .where(eq(voicebotSchema.id, voicebotId))
      .returning()
  )[0];
};

// voiceBot integrations
export const createVoiceBotIntegration = async (
  voicebotIntegration: InsertVoicebotIntegration,
) => {
  return (
    await db
      .insert(voicebotIntegrationSchema)
      .values(voicebotIntegration)
      .returning()
  )[0];
};

export const listVoiceBotIntegrations = async (
  organizationId: string,
  voicebotId: string,
  query?: any,
) => {
  let page,
    offset,
    limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  const data = await db.query.voicebotIntegrationSchema.findMany({
    where: and(
      eq(voicebotIntegrationSchema.organizationId, organizationId),
      eq(voicebotIntegrationSchema.botId, voicebotId),
    ),
  });

  if (query?.page && query?.limit) {
    const paginatedVoiceBotIntegrations = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedVoiceBotIntegrations,
    };
  } else {
    return data;
  }
};

export const getVoiceBotIntegrationById = async (
  voicebotId: string,
  voicebotIntegrationId: string,
) => {
  const data = await db.query.voicebotIntegrationSchema.findFirst({
    where: and(
      eq(voicebotIntegrationSchema.botId, voicebotId),
      eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
    ),
  });
  return data;
};

export const updateVoiceBotIntegration = async (
  voicebotId: string,
  voicebotIntegrationId: string,
  voicebotIntegration: InsertVoicebotIntegration,
) => {
  return (
    await db
      .update(voicebotIntegrationSchema)
      .set(voicebotIntegration)
      .where(
        and(
          eq(voicebotIntegrationSchema.botId, voicebotId),
          eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
        ),
      )
      .returning()
  )[0];
};

export const deleteVoicebotIntegration = async (
  voicebotId: string,
  voicebotIntegrationId: string,
) => {
  return (
    await db
      .delete(voicebotIntegrationSchema)
      .where(
        and(
          eq(voicebotIntegrationSchema.botId, voicebotId),
          eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
        ),
      )
      .returning()
  )[0];
};


// Leads creation
export const createVoiceBotLead = async (leads: any) => {
  return (
    await db.insert(voiceBotLeadSchema).values(leads).returning()
  )[0]
}

