const db = useDrizzle()

export const getOrgInteractedChatsForAnalytics = async(organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: chatSchema.createdAt })
  .from(chatSchema)
  .where(
    and(
       ...(fromDate && toDate ? [
        gte(chatSchema.createdAt, fromDate),
        lte(chatSchema.createdAt, toDate),
      ] : []),
      eq(chatSchema.interacted, true),
      eq(chatSchema.mode, "live"),
      eq(chatSchema.organizationId, organizationId),
    ),
  )
}

export const getOrgChatsForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: chatSchema.createdAt })
  .from(chatSchema)
  .where(
    and(
      ...(fromDate && toDate ? [
        gte(chatSchema.createdAt, fromDate),
        lte(chatSchema.createdAt, toDate),
      ] : []),
      eq(chatSchema.organizationId, organizationId),
    ),
  )
}