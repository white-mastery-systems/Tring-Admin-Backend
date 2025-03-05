const db = useDrizzle()

export const getOrgLeadsForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
    .select({ createdAt: leadSchema.createdAt })
    .from(leadSchema)
    .where(
      and(
      ...(fromDate && toDate ? [
        gte(leadSchema.createdAt, fromDate),
        lte(leadSchema.createdAt, toDate),
      ] : []),
        eq(leadSchema.organizationId, organizationId),
    ),
  )
}