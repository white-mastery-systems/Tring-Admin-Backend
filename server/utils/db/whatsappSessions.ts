const db = useDrizzle()

export const getOrgWhatsappSessions = async (organizationId: string, pid: string, mobile: string) => {
  return await db.query.whatsappSessionSchema.findFirst({
    where: and(
      eq(whatsappSessionSchema.organizationId, organizationId),
      eq(whatsappSessionSchema.pid, pid),
      eq(whatsappSessionSchema.mobile, mobile)
    ),
    orderBy: [desc(whatsappSessionSchema.createdAt)]
  })
}

export const createOrgWhatsappSession = async (data: any) => {
  return (await db.insert(whatsappSessionSchema).values(data).returning())[0]
}

export const getOrgTotalWhatsappSessionsForMonth = async (organizationId: string, fromDate: Date, toDate: Date) => {
  return await db.query.whatsappSessionSchema.findMany({
    where: and(
      eq(whatsappSessionSchema.organizationId, organizationId),
      gte(whatsappSessionSchema.createdAt, fromDate),
      lte(whatsappSessionSchema.createdAt, toDate)
    )
  })
}