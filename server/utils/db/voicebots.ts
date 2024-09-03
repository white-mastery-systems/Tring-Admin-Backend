import { InsertVoicebotIntegration } from "~/server/schema/voicebot";

const db = useDrizzle();

export const createVoicebot = async (voicebot: InsertVoiceBot) => {
  return (
   await db.insert(voicebotSchema).values(voicebot).returning()
  )[0]
}

export const listVoicebots = async (organizationId: string) => {
  const data = await db.query.voicebotSchema.findMany({ 
    where: eq(voicebotSchema.organizationId, organizationId)
  })
  return data
}

export const getVoicebotById = async (organizationId: string, voicebotId: string) => {
  const data = await db.query.voicebotSchema.findFirst({ 
    where: and(
      eq(voicebotSchema.organizationId, organizationId),
      eq(voicebotSchema.id, voicebotId)
    )
  })
  return data
}

export const updateVoiceBot = async (voicebotId: string, voicebot: InsertVoiceBot) => {
  return (
    await db.update(voicebotSchema)
    .set(voicebot)
    .where(  
      eq(voicebotSchema.id, voicebotId)
    )
    .returning()
  )[0]
}

export const deleteVoiceBot = async (voicebotId: string) => {
   return (
    await db
    .delete(voicebotSchema)
    .where(eq(voicebotSchema.id, voicebotId))
    .returning()
  )[0]
}


// voiceBot integrations
export const createVoiceBotIntegration = async (voicebotIntegration: InsertVoicebotIntegration) => {
   return (
    await db.insert(voicebotIntegrationSchema).values(voicebotIntegration).returning()
   )[0];
}

export const listVoiceBotIntegrations = async (organizationId: string, voicebotId: string) => {
  const data = await db.query.voicebotIntegrationSchema.findMany({
    where: and(
      eq(voicebotIntegrationSchema.organizationId, organizationId),
      eq(voicebotIntegrationSchema.botId, voicebotId)
    )
  })
  return data
}

export const getVoiceBotIntegrationById = async (voicebotId:string, voicebotIntegrationId: string) => {
  const data = await db.query.voicebotIntegrationSchema.findFirst({ 
    where: and(
      eq(voicebotIntegrationSchema.botId, voicebotId),
      eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
    )
  })
  return data
}

export const updateVoiceBotIntegration = async (voicebotId: string, voicebotIntegrationId: string, voicebotIntegration: InsertVoicebotIntegration) => {
  return (
    await db.update(voicebotIntegrationSchema)
    .set(voicebotIntegration)
    .where(and(
      eq(voicebotIntegrationSchema.botId, voicebotId),
      eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
    ))
    .returning()
  )[0]
}

export const deleteVoicebotIntegration = async (voicebotId: string, voicebotIntegrationId: string) => {
  return (
    await db.delete(voicebotIntegrationSchema)
    .where(and(
      eq(voicebotIntegrationSchema.botId, voicebotId),
      eq(voicebotIntegrationSchema.id, voicebotIntegrationId),
    )).returning()
  )[0]
}