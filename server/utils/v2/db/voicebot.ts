const db = useDrizzle()

export const getOrgTotalVoicebots = async(organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: voicebotSchema.createdAt })
  .from(voicebotSchema)
  .where( and(
    ...(fromDate && toDate ? [
        gte(voicebotSchema.createdAt, fromDate),
        lte(voicebotSchema.createdAt, toDate),
      ] : []),
    eq(voicebotSchema.organizationId, organizationId)
    )
  )
}

export const getOrgTotalCalls = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, direction?: string) => {
  return await db
    .select({ createdAt: callLogSchema.createdAt })
    .from(callLogSchema)
    .where( and(
        ...(fromDate && toDate ? [
         between(callLogSchema.createdAt, fromDate, toDate)
        ] : []),
        eq(callLogSchema.organizationId, organizationId),
        ...(direction ? [eq(callLogSchema.direction, direction)] : [])
      )
    )
  //   console.log({ data: data.length })
  // const totalMinutes = data.reduce((acc: any, item: any) => acc + Math.round(item?.duration / 60), 0)
  // return totalMinutes
}

export const getOrgVoiceLeads = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  return await db
  .select({ createdAt: voicebotLeadSchema.createdAt })
  .from(voicebotLeadSchema)
  .where( and(
    ...(fromDate && toDate ? [
        gte(voicebotLeadSchema.createdAt, fromDate),
        lte(voicebotLeadSchema.createdAt, toDate),
      ] : []),
    eq(voicebotLeadSchema.organizationId, organizationId)
  ))
}

export const getOrgVoicebotsByFilter = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined, active: boolean) => {
   return await db
  .select({ createdAt: voicebotSchema.createdAt })
  .from(voicebotSchema)
  .where( and(
    ...(fromDate && toDate ? [
        gte(voicebotSchema.createdAt, fromDate),
        lte(voicebotSchema.createdAt, toDate),
      ] : []),
    eq(voicebotSchema.active, active),
    eq(voicebotSchema.organizationId, organizationId)
    )
  )
}

export const getOrgTotalCallsInMins = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const data = await db
    .select({ duration: callLogSchema.duration })
    .from(callLogSchema)
    .where( and(
        ...(fromDate && toDate ? [
         between(callLogSchema.createdAt, fromDate, toDate)
        ] : []),
        eq(callLogSchema.organizationId, organizationId),
      )
    )
  const totalMinutes = data.reduce((acc: any, item: any) => acc + Math.round(item?.duration / 60), 0)
  return totalMinutes
}