import { InsertCallLogSchema } from "~/server/schema/voicebot"
import momentTz from "moment-timezone"

const db = useDrizzle()

export const createCallLogs = async (callLog: InsertCallLogSchema) => {
  return (await 
    db.insert(callLogSchema)
    .values(callLog)
    .returning()
  )[0]
}

export const getCallLogsList = async (organizationId: string, query: any, timeZone: string) => {
   let page, offset, limit = 0;

  if (query.page && query.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let data = await db.query.callLogSchema.findMany({
    where: eq(callLogSchema.organizationId, organizationId)
  })
  data = data.map((i: any) => ({
    ...i,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  if (query?.page && query?.limit) {
    const paginatedCallLogs = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedCallLogs,
    };
  } else {
    return data;
  }
}

export const getCallLogById = async (callLogId: string) => {
  const data = await db.query.callLogSchema.findFirst({
    where: eq(callLogSchema.id, callLogId)
  })
  return data
}

export const updateCallLogById = async (callLogId: string, callLogs: InsertCallLogSchema) => {
  return (
    await db.update(callLogSchema)
    .set(callLogs)
    .where(eq(callLogSchema.id, callLogId))
    .returning()
  )[0]
}

export const deleteCallLogById = async (callLogId: string) => {
  return (
    await db.delete(callLogSchema)
    .where(eq(callLogSchema.id, callLogId))
    .returning()
  )[0]
}