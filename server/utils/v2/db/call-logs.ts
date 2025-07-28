import { logger } from "~/server/logger";

const db = useDrizzle()

export const getVoiceCallLeadByCountry = async (organizationId: string, fromDate: Date | undefined, toDate: Date | undefined) => {
  const result = await db
    .select({
      location: callLogSchema.countryCode,
      calls: sql<number>`COUNT(DISTINCT call_logs.id)`.as("calls"),
      leads: sql<number>`COUNT(DISTINCT leads.id)`.as("leads"),
    })
    .from(callLogSchema)
    .leftJoin(voicebotLeadSchema, eq(callLogSchema.id, voicebotLeadSchema.callLogId))
    .where(
      and(
        ...(fromDate && toDate ? [
          gte(callLogSchema.createdAt, fromDate),
          lte(callLogSchema.createdAt, toDate),
        ] : []),
        eq(callLogSchema.organizationId, organizationId),
        sql`call_logs.country_code IS NOT NULL AND call_logs.country_code <> ''`
      )
    )
    .groupBy(callLogSchema.countryCode);

  return result;
};


export const getVoiceCallAndLeads = async (organizationId: string) => {
  try {
    const voiceCallEngagement = await db
      .select({
        engaged: sql<number>`COUNT(DISTINCT ${callLogSchema.id})`.as("calls"),
        leads: sql<number>`COUNT(DISTINCT ${voicebotLeadSchema.id})`.as("leads"),
      })
      .from(callLogSchema)
      .leftJoin(voicebotLeadSchema, eq(callLogSchema.id, voicebotLeadSchema.callLogId))
      .where(eq(callLogSchema.organizationId, organizationId));

    return voiceCallEngagement.map
      (item => ({
        source: "voice",
        ...item
      }));
  } catch (error: any) {
    logger.error(`Error in getVoiceCallAndLeads: ${JSON.stringify(error.message)}`);
    throw new Error("Unable to get voice call and lead metrics");
  }
}