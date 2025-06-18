import { errorResponse } from "~/server/response/error.response";

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
    if (!voiceBotIvr) {
      return errorResponse(event, 400, "IVR Configuration Missing: Please add an IVR configuration to the active bot before proceeding.")
    }
  }
  
  const update = await updateVoiceBot(voicebotId, body);

  return isValidReturnType(event, update);
})