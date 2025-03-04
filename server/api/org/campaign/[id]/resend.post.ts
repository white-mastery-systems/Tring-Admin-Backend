import { errorResponse } from "~/server/response/error.response";
import { getWhatsappCampaignCanactsByMsgStatus } from "~/server/utils/db/campaign";
import { getContactsByBucketIdAndPhone } from "~/server/utils/db/contact-list";
import { whatsappReSendCampaign } from "~/server/utils/whatsappReSendCapaign";

export default defineEventHandler(async (event) => {
    try {
        const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

        const [failedCampaigns, campaignData] = await Promise.all([
            getWhatsappCampaignCanactsByMsgStatus(campaignId, "failed"),
            getCampaignById(campaignId)
        ])
        if (!campaignData || !failedCampaigns || !failedCampaigns.length) {
            return errorResponse(event, 404, "No failed campaigns found")
        }
        const phoneNumbers = failedCampaigns.map((contact) => contact.phone)
        const templateName = campaignData.botConfig.templateName;
        const [integrationData, contactList] = await Promise.all([
            getIntegrationById(campaignData.organizationId, campaignData.botConfig.integrationId),
            getContactsByBucketIdAndPhone(campaignData.bucketId, phoneNumbers),
        ]);
        await whatsappReSendCampaign(campaignId, templateName, contactList, integrationData?.metadata);
        return { status: true, camapignId: campaignId, message: "Campaign re-sent successfully" };
    } catch (error:any) {
        return errorResponse(event, 404, error.message || "No failed campaigns found");
    }
})
