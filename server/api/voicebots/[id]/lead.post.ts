import { errorResponse } from "~/server/response/error.response";
import { createVoiceBotLead, getVoicebot } from "~/server/utils/db/voicebots";

const zodVoicebotLead = z.object({
  name: z.string(),
  phone: z.string(),
  location: z.string().optional(),
  notes: z.string().optional(),
  scheduledDate: z.string()
    .datetime({ offset: true })
    .nullish()
    .transform((val) => (val ? new Date(val) : null))
    .optional(),
})

export default defineEventHandler(async (event) => {
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const body = await isValidBodyHandler(event, zodVoicebotLead)

  const voicebotDetail = await getVoicebot(voicebotId)
  if(!voicebotDetail)  return errorResponse(event, 400, "Voicebot not exist")
  
  if(!voicebotDetail.active) return errorResponse(event, 400, "Voicebot is not active")

  // create voicebot lead
  const data = await createVoiceBotLead({
    ...body,
    botId: voicebotId,
    organizationId: voicebotDetail.organizationId,
  })
  if(!data) {
    return errorResponse(event, 500, "Failed to generate voicebot leads")
  }
  return "Voicebot leads are created";
});
