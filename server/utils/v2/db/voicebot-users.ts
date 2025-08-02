import { count } from "drizzle-orm"
import momentTz from "moment-timezone"

const db = useDrizzle()

export const getUniqueCallNumbers = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
   const result = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${callLogSchema.from})`
    })
    .from(callLogSchema)
    .where(
      and(
        ...(fromDate && toDate
          ? [
              gte(callLogSchema.createdAt, fromDate),
              lte(callLogSchema.createdAt, toDate)
            ]
          : []),
        eq(callLogSchema.organizationId, organizationId)
      )
    )

  return result[0]?.count || 0
}

export const getVoicebotEngagementMetrics = async (
  organizationId: string,
  fromDate?: Date,
  toDate?: Date
) => {
  const baseConditions = [
    eq(callLogSchema.organizationId, organizationId),
    ...(fromDate && toDate
      ? [
          gte(callLogSchema.createdAt, fromDate),
          lte(callLogSchema.createdAt, toDate),
        ]
      : [])
  ]

  // 1. Total Unique Callers
  const uniqueCallers = await db
    .select({ 
      count: sql<number>`COUNT(DISTINCT ${callLogSchema.from})`
    })
    .from(callLogSchema)
    .where(and(...baseConditions))

  const totalUnique = Number(uniqueCallers[0]?.count) || 0

  // 2. Returning Callers (phone numbers with more than 1 call)
  const returningCallers = await db
    .select({
      phoneNumber: callLogSchema.from
    })
    .from(callLogSchema)
    .where(and(...baseConditions))
    .groupBy(callLogSchema.from)
    .having(sql`COUNT(*) > 1`)

  const reengaged = returningCallers.length
  
  const rate = totalUnique > 0 ? (reengaged / totalUnique) * 100 : 0

  return {
    totalUniqueCallers: totalUnique,
    returningCallers: reengaged,
    reEngagementRate: `${Math.round(rate)}%`
  }
}

export const getVoicebotUsersBySegments = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const groupedPhoneCountsQuery = db
    .select({
      phoneNumber: callLogSchema.from,
      callCount: count(callLogSchema.id).as("callCount"),
    })
    .from(callLogSchema)
    .where(
      and(
        eq(callLogSchema.organizationId, organizationId),
        ...(fromDate && toDate
          ? [
              gte(callLogSchema.createdAt, fromDate),
              lte(callLogSchema.createdAt, toDate),
            ]
          : []),
        isNotNull(callLogSchema.from)
      )
    )
    .groupBy(callLogSchema.from);

  const dropOffUserQuery = db
  .select({ metrics: callLogSchema.metrics })
  .from(callLogSchema)
  .where(
    and(
      eq(callLogSchema.organizationId, organizationId),
      ...(fromDate && toDate
        ? [
            gte(callLogSchema.createdAt, fromDate),
            lte(callLogSchema.createdAt, toDate),
          ]
        : []),
      isNotNull(callLogSchema.metrics)
    )
  )

  const [groupedPhoneCountResult, dropOffUserResult] = await Promise.all([
    groupedPhoneCountsQuery,
    dropOffUserQuery
  ]);

  const dropoffCalls = dropOffUserResult.filter((item: any) => {
    const metrics = item?.metrics
    return metrics?.dropOffRate === true
  })

  let firstTimeUsers = 0;
  let frequentUsers = 0;

  for (const entry of groupedPhoneCountResult) {
    if (entry.callCount === 1) firstTimeUsers += 1;
    else frequentUsers += 1;
  }

  return {
    firstTimeUsers,
    frequentUsers,
    totalUniqueUsers: groupedPhoneCountResult.length,
    dropOffUsers: dropoffCalls.length || 0
  };
};
