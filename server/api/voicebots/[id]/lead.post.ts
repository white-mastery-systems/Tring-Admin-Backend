import { errorResponse } from "~/server/response/error.response";
import { createVoiceBotLead, getVoicebot } from "~/server/utils/db/voicebots";
import momentTz from "moment-timezone"

const zodVoicebotLead = z.object({
  name: z.string(),
  phone: z.string(),
  location: z.string().optional(),
  notes: z.string().optional(),
  scheduledDate: z.string().optional(),
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
  
  let scheduledUTCDate 
  
  if(body?.scheduledDate) {
    const localDate = body?.scheduledDate;
    const timeZone = voicebotDetail?.botDetails?.timezone; // Replace with your timezone
    const botTime = momentTz.tz(localDate, timeZone);
    // Convert bot local time to UTC time
    scheduledUTCDate = botTime.utc()
  }
  
  // create voicebot lead
  const data = await createVoiceBotLead({
    ...body,
    botId: voicebotId,
    organizationId: voicebotDetail.organizationId,
    ...body.scheduledDate && { scheduledDate: scheduledUTCDate }
  })
  if(!data) {
    return errorResponse(event, 500, "Failed to generate voicebot leads")
  }
  return "Voicebot leads are created";
});
