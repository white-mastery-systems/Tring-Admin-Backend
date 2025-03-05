const db = useDrizzle()

export const getUniqueVisitorsForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: orgVisitorSchema.createdAt })
  .from(orgVisitorSchema)
  .where(
    and(
       ...(fromDate && toDate ? [
        gte(orgVisitorSchema.createdAt, fromDate),
        lte(orgVisitorSchema.createdAt, toDate),
      ] : []),
      eq(orgVisitorSchema.organizationId, organizationId),
    ),
  )
}