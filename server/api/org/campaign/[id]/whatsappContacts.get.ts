import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getWhatsappContactsByCampaignId, getWhatsappCampaignContactsByMsgStatus } from "~/server/utils/db/campaign";

const zodQueryvalidator = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";

    const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    const query = await isValidQueryHandler(event, zodQueryvalidator)

    const [data, failedCampaigns] = await Promise.all([
      getWhatsappContactsByCampaignId(campaignId, query, timeZone),
      getWhatsappCampaignContactsByMsgStatus(campaignId, "failed"),
    ]);
    data.failedCampaigns = false
    if(failedCampaigns && failedCampaigns.length) { data.failedCampaigns = true }

    return data

  } catch (error: any) {
    logger.error(`get Whatsapp Campaign contact list API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch whatsapp campaign contact list")
  }
})