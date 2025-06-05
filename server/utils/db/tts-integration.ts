import { InsertTtsIntegration } from "~/server/schema/admin"
import momentTz from "moment-timezone"

const db = useDrizzle()

export const createTtsIntegration = async (data: InsertTtsIntegration) => {
  return (await db.insert(ttsIntegrationSchema).values(data).returning())[0]
}

export const getTtsIntegrationList = async (organizationId: string, query: any, timeZone: string) => {
  let page,
    offset,
    limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  let data = await db.query.ttsIntegrationSchema.findMany({
    where: and(
      eq(ttsIntegrationSchema.organizationId, organizationId),
      query?.integrationName ? ilike(ttsIntegrationSchema.ttsIntegrationName, `%${query.integrationName}%`) : undefined
    ),
    orderBy: [desc(ttsIntegrationSchema.createdAt)]
  })

  data.map((i: any) => ({
      ...i,
      createdAt: momentTz(i.date).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  if (query?.page && query?.limit) {
    const paginatedTtsIntegration = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedTtsIntegration,
    };
  } else {
    return data;
  }
}

export const getTtsIntegrationById = async (id: string) => {
  return await db.query.ttsIntegrationSchema.findFirst({
    where: eq(ttsIntegrationSchema.id, id)
  })
}

export const getTtsIntegrationByName = async (name: string, organizationId: string) => {
   return await db.query.ttsIntegrationSchema.findFirst({
    where: and(
      eq(ttsIntegrationSchema.organizationId, organizationId),
      ilike(ttsIntegrationSchema.ttsIntegrationName, name)
    )
  })
}

export const isTtsNameAlreadyExists = async (ttsIntegrationName: string, id: string) => {
  return await db.query.ttsIntegrationSchema.findFirst({
    where: and(
      ilike(ttsIntegrationSchema.ttsIntegrationName, ttsIntegrationName),
      ne(ttsIntegrationSchema.id, id)
    )
  })
}

export const updateTtsIntegration = async (id: string, data: InsertTtsIntegration) => {
  return (
    await db.update(ttsIntegrationSchema).set({
      ...data,
      updatedAt: new Date()
    }).where(
      eq(ttsIntegrationSchema.id, id)
    ).returning()
  )[0]
}

export const deleteTtsIntegration = async (id: string) => {
  return (
    await db.delete(ttsIntegrationSchema).where(
      eq(ttsIntegrationSchema.id, id)
    ).returning()
  )[0]
}
