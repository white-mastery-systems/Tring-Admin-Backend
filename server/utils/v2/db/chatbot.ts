const db = useDrizzle();

export const getOrgTotalChatBotsForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, active?: boolean) => {
  return await db
  .select({ createdAt: chatBotSchema.createdAt })
  .from(chatBotSchema)
  .where(
    and(
      ...(fromDate && toDate ? [
        gte(chatBotSchema.createdAt, fromDate),
        lte(chatBotSchema.createdAt, toDate),
      ] : []),
      (active ? active === true ? isNotNull(chatBotSchema.documentId) : isNull(chatBotSchema.documentId): undefined),
      eq(chatBotSchema.organizationId, organizationId),
    ),
  )
}

export const getOrgChatBotsByFilterForAnalytics = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, active?: boolean) => {
  return await db
  .select({ createdAt: chatBotSchema.createdAt })
  .from(chatBotSchema)
  .where(
    and(
      ...(fromDate && toDate ? [
        gte(chatBotSchema.createdAt, fromDate),
        lte(chatBotSchema.createdAt, toDate),
      ] : []),
      (active === true ? isNotNull(chatBotSchema.documentId) : isNull(chatBotSchema.documentId)),
      eq(chatBotSchema.organizationId, organizationId),
    ),
  )
}
