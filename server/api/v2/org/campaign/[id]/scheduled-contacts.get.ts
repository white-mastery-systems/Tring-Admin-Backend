import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getNewCampaignById } from "~/server/utils/v2/db/campaign";
import { getVoiceScheduledContactsByCampaignId } from "~/server/utils/v2/db/voicebot";
import momentTz from "moment-timezone"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    
    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";

    const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    const query = await isValidQueryHandler(event, z.object({
      q: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.string().optional(),
      period: z.string().optional()
    }))
  
    const campaignDetail = await getNewCampaignById(campaignId)
    if(!campaignDetail) {
      return errorResponse(event, 404, "Campaign not found")
    }

    const voiceCampaignTotalContacts = await getVoiceScheduledContactsByCampaignId(campaignId, timeZone)

    const deliveredContacts = voiceCampaignTotalContacts.filter((i: any)=> !["Not Dialed", "Failed", "No Response"].includes(i.callStatus))
    const failedContacts = voiceCampaignTotalContacts.filter((j: any) => ["Failed", "Invalid Number"].includes(j.callStatus))
    const notResponsedContacts = voiceCampaignTotalContacts.filter((j: any) => j.callStatus === "No Response")

    const data = await getVoiceScheduledContactsByCampaignId(campaignId, timeZone, query)

    return {
      campaignName: campaignDetail?.campaignName,
      contactMethod: campaignDetail?.contactMethod,
      createdAt: momentTz(campaignDetail?.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
      totalContacts: voiceCampaignTotalContacts.length,  
      deliveredContacts: deliveredContacts.length,
      failedContacts: failedContacts.length,
      notResponsedContacts: notResponsedContacts.length,
      scheduledContacts: data
    }
  } catch(error: any) {
    logger.error(`Get Campaign scheduled contacts API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get Scheduled contacts List")
  }
})