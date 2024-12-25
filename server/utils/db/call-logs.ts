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
  // Period-based filtering
  let fromDate: Date | undefined;
  let toDate: Date | undefined;
  if (query?.period) {
    const queryDate = getDateRangeForFilters(query, timeZone);
    fromDate = queryDate?.from;
    toDate = queryDate?.to;
  }

  let page, offset, limit = 0;

  if (query.page && query.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  let data = await db.query.callLogSchema.findMany({
    where: and(
      eq(callLogSchema.organizationId, organizationId),
      query?.period && fromDate && toDate
        ? between(callLogSchema.date, fromDate, toDate)
        : undefined,
    ),
    with: {
      bot: {
        where: query?.q ? ilike(voicebotSchema.name, `%${query.q}%`) : undefined,
        columns: {
          name: true
        }
      }
    },
     orderBy: [desc(callLogSchema.date)],
  })
  data = data.map((i: any) => ({
    ...i,
    date: momentTz(i.date).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));

  if(query?.q) {
    data = data.filter((i: any) => i.bot !== null);
  }

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

export const getCallLogById = async (callLogId: string, timeZone: string) => {
  let data: any = await db.query.callLogSchema.findFirst({
    where: eq(callLogSchema.id, callLogId)
  })
  if(data?.date) {
    data.date =  momentTz(data.date).tz(timeZone).format("DD MMM YYYY hh:mm A")
  }  
  return data
}

export const updateCallLogById = async (callLogId: string, callLogs: InsertCallLogSchema) => {
  return (
    await db.update(callLogSchema)
    .set({
      ...callLogs,
      updatedAt: new Date()
    })
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

// get current month call-logs duration
export const getCurrentMonthCallLogList = async (organizationId: string, currentMonthStartDate: Date, currentMonthEndDate: Date) => {
  return db.query.callLogSchema.findMany({
    columns: { 
       duration: true,
       date: true,
    },
    where: and(
      eq(callLogSchema.organizationId, organizationId),
      gte(callLogSchema.date, currentMonthStartDate),
      lte(callLogSchema.date, currentMonthEndDate)
    )
  })
}