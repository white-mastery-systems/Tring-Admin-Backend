import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getNewCampaignById } from "~/server/utils/v2/db/campaign";
import { getVoiceScheduledContactsByCampaignId } from "~/server/utils/v2/db/voicebot";
import momentTz from "moment-timezone"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    
    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";

    const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    const query = await isValidQueryHandler(event, z.object({
      q: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.string().optional(),
      period: z.string().optional(),
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
    }))
  
    const campaignDetail = await getNewCampaignById(campaignId)
    if(!campaignDetail) {
      return errorResponse(event, 404, "Campaign not found")
    }
    
    let data = []; let campaignTotalContacts = []; let deliveredContacts = []; let failedContacts = []

    const contactMethod = campaignDetail.contactMethod

    if(contactMethod === "voice") {
      campaignTotalContacts = await getVoiceScheduledContactsByCampaignId(organizationId, campaignId, timeZone)
      data = await getVoiceScheduledContactsByCampaignId(organizationId, campaignId, timeZone, query)

      deliveredContacts = campaignTotalContacts.filter((i: any)=> !["Not Dialed", "Failed"].includes(i.callStatus))
      failedContacts = campaignTotalContacts.filter((j: any) => ["Failed"].includes(j.callStatus))
    } else { 
      // contact method is whatsapp
      campaignTotalContacts  = await getWhatsappContactsByCampaignId(campaignId, timeZone)
      data = await getWhatsappContactsByCampaignId(campaignId, timeZone, query)

      deliveredContacts = campaignTotalContacts.filter((i: any)=> ["delivered", "sent", "read"].includes(i.messageStatus.toLowerCase()))
      failedContacts = campaignTotalContacts.filter((j: any) => ["failed"].includes(j.messageStatus.toLowerCase()))  
    }

    return {
      campaignName: campaignDetail?.campaignName,
      contactMethod: campaignDetail?.contactMethod,
      createdAt: momentTz(campaignDetail?.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
      totalContacts: campaignTotalContacts.length,  
      deliveredContacts: deliveredContacts.length,
      failedContacts: failedContacts.length,
      scheduledContacts: data
    }
  } catch(error: any) {
    logger.error(`Get Campaign scheduled contacts API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to get Scheduled contacts List")
  }
})