import { errorResponse } from "~/server/response/error.response";
import { createVoiceBotLead, getVoicebot } from "~/server/utils/db/voicebots";
import momentTz from "moment-timezone"
import { generateVoicebotLeads } from "~/server/utils/v2/generateLeads/voicebot";
import { logger } from "~/server/logger";

const zodVoicebotLead = z.object({
  name: z.string(),
  phone: z.string(),
  countryCode: z.string(),
  callSid: z.string(),
  callOutcome: z.string(),
  callLogId: z.string(),
  location: z.string().optional(),
  notes: z.string().optional(),
  scheduledDate: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
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
      const timeZone = voicebotDetail?.botDetails?.timezone || "Asia/Kolkata"; // Replace with your timezone
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
    
    try {
      const existingContact = await checkIfContactExists(
        voicebotDetail.organizationId,
        body?.phone,
        "insert"
      );
      if(!existingContact) {
        await addContact({
          name: body?.name,
          phoneNumber: body?.phone,
          countryCode: body?.countryCode,
          organizationId: voicebotDetail.organizationId,
          source: "voicebot"
        })
      }
    } catch (error: any) {
      logger.error(`Create voicebot lead in contacts table Error: ${JSON.stringify(error.message)}`)
    }
   
  
    generateVoicebotLeads({
      botUser: {
        name: body?.name,
        mobile: body?.phone,
        countryCode: body?.countryCode
      },
      callLogId: body?.callLogId,
      notes: body?.notes,
      voicebotDetail
    })
    return "Voicebot leads are created";
  } catch (error: any) {
    logger.error(`Voicebot lead creation API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Failed to create voicebot lead")
  }
});
