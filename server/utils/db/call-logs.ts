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

export const getCallLogsList = async (organizationId: string, timeZone?: string,  query?: any) => {
  // Period-based filtering
  let fromDate: Date | undefined;
  let toDate: Date | undefined;
  if (query?.period) {
    const queryDate = getDateRangeForFilters(query, timeZone);
    fromDate = queryDate?.from;
    toDate = queryDate?.to;
  }

  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
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
      query?.voicebotId && query?.voicebotId !== "all"
        ? eq(callLogSchema.botId, query.voicebotId): undefined,
      query?.direction ? eq(callLogSchema.direction, query.direction) : undefined,
    ),
    with: {
      bot: {
        where: query?.q ? ilike(voicebotSchema.name, `%${query.q}%`) : undefined,
        columns: {
          name: true
        }
      }
    },
    columns: {
      callTranscription: false,
      summary: false
    },
     orderBy: [desc(callLogSchema.date)],
  })
  data = data.map((i: any) => ({
    ...i,
    date: momentTz(i.date).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    ...(i.direction === "outbound" &&
      {
        from: i.exophone,
        exophone: i.from
      }
    ),
  }));

  if(query?.q) {
    data = data.filter((i: any) => i.bot !== null);
  }

  if(query?.outcome && query?.outcome !== "all") {
    data = data.filter((i: any) => i.metrics.callOutcome === query?.outcome)
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

export const getCallLogById = async (id: string, timeZone: string, query?: any) => {
  let data: any = await db.query.callLogSchema.findFirst({
    where: query.callSid === "true"
     ? eq(callLogSchema.callSid, id)
     : eq(callLogSchema.id, id)
  })

  // Format date
  if (data.date) {
    data.date = momentTz(data.date).tz(timeZone).format("DD MMM YYYY hh:mm A");
  }

  // Swap from and exophone based on direction
  if (data.direction === "outbound") {
    [data.from, data.exophone] = [data.exophone, data.from];
  }

  return data;
}

export const updateCallLogById = async (callLogId: string, callLogs: any) => {
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
export const getCurrentMonthCallLogList = async (organizationId: string, startDate: Date, endDate: Date) => {
  return await db.query.callLogSchema.findMany({
    columns: { 
       duration: true,
       date: true,
    },
    where: and(
      eq(callLogSchema.organizationId, organizationId),
      gte(callLogSchema.date, startDate),
      lte(callLogSchema.date, endDate)
    )
  })
}

export const getCallLogByCallSid = async (callSid: string) => {
  return await db.query.callLogSchema.findFirst({
    where: eq(callLogSchema.callSid, callSid)
  })
}