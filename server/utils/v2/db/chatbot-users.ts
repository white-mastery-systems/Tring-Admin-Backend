import { count, inArray } from "drizzle-orm"

const db = useDrizzle()

export const getOrgTotalChatbotUsers = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const data = await db
    .select({ createdAt: botUserSchema.createdAt })
    .from(botUserSchema)
    .where(
      and( 
        ...(fromDate && toDate ? [
          gte(botUserSchema.createdAt, fromDate),
          lte(botUserSchema.createdAt, toDate),
        ] : []),
        eq(botUserSchema.organizationId, organizationId),
      )
    )
  return data.length
}

export const getOrgReEnagedChatbotUsers = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const data = await db
    .select({ createdAt: botUserSchema.createdAt })
    .from(botUserSchema)
    .where(
      and( 
        ...(fromDate && toDate ? [
          gte(botUserSchema.createdAt, fromDate),
          lte(botUserSchema.createdAt, toDate),
        ] : []),
        gt(botUserSchema.visitedCount, 1),
        eq(botUserSchema.organizationId, organizationId),
      )
    )
  return data.length
}

// High-value Users
const HIGH_VALUE_INTENTS = [
  "schedule_appointment",
  "schedule_call",
  "site_visit",
  "location",
  "virtual_tour",
  "images",
  "brochures"
];

export const getChatbotUserBySegments = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const frequentUsersQuery = db
    .select({ count: count().as('count') })
    .from(botUserSchema)
    .where(
      and(
        eq(botUserSchema.organizationId, organizationId),   
        ...(fromDate && toDate ? [
          gte(botUserSchema.createdAt, fromDate),
          lte(botUserSchema.createdAt, toDate),
        ] : []),
        gt(botUserSchema.visitedCount, 1)
      )
    );

  const firstTimeUsersQuery = db
    .select({ count: count().as('count') })
    .from(botUserSchema)
    .where(
      and(
        eq(botUserSchema.organizationId, organizationId),
        ...(fromDate && toDate ? [
          gte(botUserSchema.createdAt, fromDate),
          lte(botUserSchema.createdAt, toDate),
        ] : []),
        eq(botUserSchema.visitedCount, 1)
      )
    );

  const highValueUserQuery = db
    .select({
      userId: timelineSchema.userId
    })
    .from(timelineSchema)
    .where(
      and(
        eq(timelineSchema.orgId, organizationId),
        ...(fromDate && toDate ? [
          gte(timelineSchema.createdAt, fromDate),
          lte(timelineSchema.createdAt, toDate),
        ] : []),
        inArray(timelineSchema.event, HIGH_VALUE_INTENTS),
        isNotNull(timelineSchema.userId)
      )
    ).groupBy(timelineSchema.userId)

  const dropOffUserQuery = db
    .select({ metadata: leadSchema.metadata }) 
    .from(leadSchema)
    .where(
      and(
        ...(fromDate && toDate ? [
          gte(leadSchema.createdAt, fromDate),
          lte(leadSchema.createdAt, toDate),
        ] : []),
        eq(leadSchema.organizationId, organizationId),
        isNotNull(leadSchema.metadata),
      ),  
    )

  const [frequentUsersResult, firstTimeUsersResult, highValueUsersResult, dropOffUserResult] = await Promise.all([
    frequentUsersQuery,
    firstTimeUsersQuery,
    highValueUserQuery,
    dropOffUserQuery
  ]);

  const dropOffUsers = dropOffUserResult.filter((lead: any) => { 
    const metadata: any = lead.metadata || {};
    const behavioralMetrics = metadata.behavioralMetrics || {};
    return (
      behavioralMetrics.dropOffRate === true
    );
  })

  // return data.length
  return {
    frequentUsers: frequentUsersResult[0].count,
    firstTimeUsers: firstTimeUsersResult[0].count,
    highValueUsers: highValueUsersResult.length,
    dropOffUsers: dropOffUsers.length
  }
}
