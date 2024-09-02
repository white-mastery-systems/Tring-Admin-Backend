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

export const updateVoiceBot = async (voicebotId: string, voiceBot: InsertVoiceBot) => {
  return (
    await db.update(voicebotSchema)
    .set(voiceBot)
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