import { checkCampaignNameExist, creatCampaignWhatsappContacts } from "~/server/utils/db/campaign";
import { errorResponse } from "~/server/response/error.response";
import { createVoicebotSchedular } from "~/server/utils/db/voicebots";
import { getContactsByChatbotBucketId } from "~/server/utils/db/contact-list";
import { scheduleWhatsAppCampaign } from "~/server/utils/whatsappSchedule";
import { logger } from "~/server/logger";
import { getInteractedSessions } from "~/server/utils/db/chats";
import { calculateDateRange } from "~/server/utils/db/organization";

const zodInsertCampaign = z.object({
  campaignName: z.string(),
  contactMethod: z.string(),
  bucketId: z.string(),
  botConfig: z.object({
    botId: z.string().optional(),
    workingStartTime: z.string().optional(),
    workingEndTime: z.string().optional(),
    callsPerTrigger: z.string().optional(),
    date: z.string().optional(),
    scheduleTime: z.string().optional(),
    templateId: z.string().optional(),
    integrationId: z.string().optional(),
    templateName: z.string().optional(),
  }),
});

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader)
    ? timeZoneHeader[0]
    : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const body = await isValidBodyHandler(event, zodInsertCampaign);

  const type = body?.contactMethod === "whatsapp" ? "chat" : "voice"

  const orgSubscription = await getOrgZohoSubscription(organizationId, type)

  if (orgSubscription?.subscriptionStatus !== "active") {
    return errorResponse(event, 400, "Subscription is not active");
  }

  const isAlreadyExist = await checkCampaignNameExist(
    organizationId,
    body?.campaignName,
  );

  if (isAlreadyExist)
    return errorResponse(event, 400, "Campaign name already exists");

  const data: any = await createCampaign({
    ...body,
    organizationId,
  });

  if (data.contactMethod === "voice") {
    // fetch voice contact of bucket
    const voiceContactList = await getContactsByVoiceBucketId(data?.bucketId);

    const voiceContactIds = voiceContactList.map((i) => i.contactId);

    const mapVoiceContactWithSchedular = voiceContactIds.map((contactId) => {
      return {
        campaignId: data.id,
        bucketId: data?.bucketId!,
        contactId: contactId,
        botId: data?.botConfig?.botId,
        organizationId: organizationId,
      };
    });

    // create campaign data in schedular table
    await createVoicebotSchedular(mapVoiceContactWithSchedular);
  }

  if (data.contactMethod === "whatsapp") {
    // fetch chatbot contacts of bucket
    const chatbotContactList = await getContactsByChatbotBucketId(
      data?.bucketId,
    );
                                                                                                                                                         
    const integrationData = await getIntegrationById(
      organizationId,
      data?.botConfig?.integrationId,
    );

    // schedule whatsapp campaign
    await scheduleWhatsAppCampaign(
      data?.id,
      data?.botConfig?.date,
      data?.botConfig?.scheduleTime,
      chatbotContactList,
      data?.botConfig?.templateName,
      integrationData,
      timeZone,
    );

    const campaignContactList = chatbotContactList.map((i) => {
      return {
        campaignId: data?.id,
        countryCode: i?.contacts.countryCode,
        firstName: i?.contacts.firstName,
        lastName: i?.contacts?.lastName,
        phone: i?.contacts.phone,
        organizationId,
      } 
    })

    // console.log({ campaignContactList })

    await creatCampaignWhatsappContacts(campaignContactList)

    logger.info(`WhatsApp campaign created successfully, organizationId: ${organizationId}`);
  }

  return data;
});
