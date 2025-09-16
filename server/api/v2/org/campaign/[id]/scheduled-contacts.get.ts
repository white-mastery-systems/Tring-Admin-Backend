import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getNewCampaignById } from "~/server/utils/v2/db/campaign";
import { getVoiceScheduledContactsByCampaignId } from "~/server/utils/v2/db/voicebot";
import momentTz from "moment-timezone"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";

    const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"));
    const query = await isValidQueryHandler(event, z.object({
      q: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.string().optional(),
      period: z.string().optional(),
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
    }));

    const campaignDetail = await getNewCampaignById(campaignId);
    if (!campaignDetail) {
      return errorResponse(event, 404, "Campaign not found");
    }

    const result =
      campaignDetail.contactMethod === "voice"
        ? await getVoiceScheduledContactsByCampaignId(organizationId, campaignId, timeZone, query)
        : await getWhatsappContactsByCampaignId(organizationId, campaignId, timeZone, query);

    // return result

    return {
      campaignName: campaignDetail.campaignName,
      contactMethod: campaignDetail.contactMethod,
      createdAt: momentTz(campaignDetail.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
      totalContacts: result.totalContacts,
      deliveredContacts: result.deliveredContacts,
      failedContacts: result.failedContacts,
      scheduledContacts: result.scheduledContacts,
    };
  } catch (error: any) {
    logger.error(`Get Campaign scheduled contacts API Error: ${error.message}`);
    return errorResponse(event, 500, "Unable to get Scheduled contacts List");
  }
});
