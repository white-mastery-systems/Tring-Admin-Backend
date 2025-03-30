

const db = useDrizzle()

export const getOrgTotalBotUsers = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
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

export const getOrgReEnagedBotUsers = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
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
