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
        /*{
            "id": "aaef1bf7-7d57-42bf-a7fd-d022872124b1",
            "campaignName": "whatsapp campaign 2",
            "contactMethod": "whatsapp",
            "bucketId": "3cf932e4-5b28-4497-bd0c-335589a432b5",
            "botConfig": {
                "date": "2025-03-03",
                "scheduleTime": "11:03",
                "templateName": "habeeb",
                "integrationId": "f6ecba82-ebe2-4554-8dd5-be25ec90ecfb"
            },
            "organizationId": "f3a9d380-222a-4228-a5ae-e1dc03682651",
            "createdAt": "2025-03-03T05:32:23.060Z",
            "updatedAt": "2025-03-03T05:32:23.060Z"
        }*/

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
