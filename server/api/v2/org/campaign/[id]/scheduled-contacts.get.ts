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
    
    let data, campaignTotalContacts = []

    console.log({ contactmethod : campaignDetail.contactMethod, campaignId })
    const contactMethod = campaignDetail.contactMethod

    if(contactMethod === "voice") {
      campaignTotalContacts = await getVoiceScheduledContactsByCampaignId(campaignId, timeZone)
      data = await getVoiceScheduledContactsByCampaignId(campaignId, timeZone, query)
    } else { // contact method is whatsapp
      console.log("Fetching WhatsApp contacts for campaign")
      campaignTotalContacts  = await getWhatsappContactsByCampaignId(campaignId, timeZone)
      data = await getWhatsappContactsByCampaignId(campaignId, timeZone, query)
    }

    const deliveredContacts = campaignTotalContacts.filter((i: any)=> !["Not Dialed", "Failed", "No Response"].includes(contactMethod === "voice" ? i.callStatus : i.interactionStatus))
    const failedContacts = campaignTotalContacts.filter((j: any) => ["Failed", "Invalid Number"].includes(contactMethod === "voice" ? j.callStatus : j.interactionStatus))
    const notResponsedContacts = campaignTotalContacts.filter((j: any) => contactMethod === "voice" ? j.callStatus === "No Response" : j.interactionStatus === "No Response")

    return {
      campaignName: campaignDetail?.campaignName,
      contactMethod: campaignDetail?.contactMethod,
      createdAt: momentTz(campaignDetail?.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
      totalContacts: campaignTotalContacts.length,  
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