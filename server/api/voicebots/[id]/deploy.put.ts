const db = useDrizzle()

const zodUpdateVoicebotValidation = z.object({
  active: z.boolean()
})

export default defineEventHandler(async (event) => {
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body: any = await isValidBodyHandler(event, zodUpdateVoicebotValidation);

  if(body.active) {
    const voiceBotIvr = await db.query.voicebotSchema.findFirst({ 
      where: and(
        isNotNull(voicebotSchema.ivrConfig),
        eq(voicebotSchema.id, voicebotId)
      )
    })
    if(!voiceBotIvr) {
      return sendError(
        event,
        createError({ 
          statusCode: 400, 
          statusMessage: "Please add ivr config to active bot" 
        }),
      );
    }
  }
  
  const update = await updateVoiceBot(voicebotId, body);

  return isValidReturnType(event, update);
})