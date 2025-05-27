import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { z } from "zod";
import { getContactListByContactGroupIds } from "~/server/utils/v2/db/contact-group";
import { createNewCampaign, getNewCampaignByName } from "~/server/utils/v2/db/campaign";
import { createVoiceCallSchdeuling } from "~/server/utils/v2/db/voicebot";

const zodCreateCampaignSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  contactMethod: z.enum(["voice", "whatsapp"]),
  bucketIds: z.string().array().min(1, "Bucket ID is required"),
  instantAction: z.boolean(),
  botConfig: z.object({
    botId: z.string().optional(),
    date: z.string().optional(),

    // Voice campaign
    workingStartTime: z.string().optional(),
    workingEndTime: z.string().optional(),

    // WhatsApp campaign
    scheduleTime: z.string().optional(),
    templateId: z.string().optional(),
    integrationId: z.string().optional(),
    templateName: z.string().optional(),
    region: z.string().optional(),
  }),
  retryAttempt: z.object({
    duration: z.number(),
    frequencyPerDay: z.number(),
    timeSlots: z.string().array()
  }).optional()
}).superRefine((data, ctx) => {
  const { contactMethod, instantAction, botConfig } = data;

  // VOICE-specific validation
  if (contactMethod === "voice" && !instantAction) {
    if (!botConfig.workingStartTime) {
      ctx.addIssue({
        path: ["botConfig", "workingStartTime"],
        message: "Working start time is required for scheduled voice campaign",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!botConfig.workingEndTime) {
      ctx.addIssue({
        path: ["botConfig", "workingEndTime"],
        message: "Working end time is required for scheduled voice campaign",
        code: z.ZodIssueCode.custom,
      });
    }
    if (!botConfig.date) {
      ctx.addIssue({
        path: ["botConfig", "date"],
        message: "Date is required for scheduled voice campaign",
        code: z.ZodIssueCode.custom,
      });
    }
  }

  // WHATSAPP-specific validation
  if (contactMethod === "whatsapp" && !instantAction) {
    const requiredFields = [
      { key: "date", message: "Date is required for scheduled WhatsApp campaign" },
      { key: "scheduleTime", message: "Schedule time is required" },
      { key: "integrationId", message: "Integration ID is required" },
      { key: "templateName", message: "Template name is required" },
      { key: "region", message: "Region is required" },
    ];

    requiredFields.forEach(({ key, message }) => {
      if (!botConfig[key as keyof typeof botConfig]) {
        ctx.addIssue({
          path: ["botConfig", key],
          message,
          code: z.ZodIssueCode.custom,
        });
      }
    });
  }
});

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const body = await isValidBodyHandler(event, zodCreateCampaignSchema)
    const type = body?.contactMethod === "whatsapp" ? "chat" : "voice"

    const orgSubscription = await getOrgZohoSubscription(organizationId, type)  
    if (orgSubscription?.subscriptionStatus !== "active") {
      return errorResponse(event, 400, "Subscription is not active");
    }

    const isAlreadyExist = await getNewCampaignByName(
      organizationId,
      body?.campaignName,
      "insert"
    );
    if (isAlreadyExist) return errorResponse(event, 400, "Campaign name already exists");

    const data: any = await createNewCampaign({
      ...body,
      organizationId,
      ...body.contactMethod === "voice" && !body.retryAttempt && {
        retryAttempt: {
          duration: 1,
          frequencyPerDay: 1,
          timeSlots: ["10.00"]
        }
      }
    });

     // fetch voice contact of bucket
     const contactGroupContactLinks = await getContactListByContactGroupIds(data.bucketIds)

     // return contactGroupContactLinks
    
    if(data.contactMethod === "voice") {
      const mapVoiceContactWithSchedular: any = contactGroupContactLinks.map((contactGroupLink) => {
        return {
          campaignId: data.id,
          contactGroupId: contactGroupLink.contactGroupId,
          contactId: contactGroupLink.contactId,
          botId: data?.botConfig?.botId,
          organizationId: organizationId,
        };
      });
  
      // create campaign data in schedular table
      await createVoiceCallSchdeuling(mapVoiceContactWithSchedular);
    }
    
    if(data.contactMethod === "whatsapp") {
      const integrationData: any = await getIntegrationById(
        organizationId,
        data?.botConfig?.integrationId,
      );
      if(!data.instantAction) {
          logger.info(`Schedule whatsapp campaign`)
          // schedule whatsapp campaign
          await scheduleWhatsAppCampaignV2(
            data.id,
            data.botConfig.date,
            data.botConfig.scheduleTime,
            contactGroupContactLinks,
            data.botConfig.templateName,
            integrationData,
            data.botConfig.region,
          )
      } else {
          logger.info(`trigger whatsapp template immediately - campaignId: ${data.id}`)
          // trigger whatsapp template immediately
          await sendWhatsappCampaignWithTemplate({
             templateName: data.botConfig.templateName,
             campaignId: data.id, 
             metadata: integrationData.metadata!,
             contactList: contactGroupContactLinks
          })
      }
      const campaignContactList = contactGroupContactLinks.map((i: any) => {
        return {
          campaignId: data?.id,
          countryCode: i?.contact.countryCode,
          firstName: i?.contact.name,
          phone: i?.contact.phoneNumber,
          organizationId,
        } 
      })
      await creatCampaignWhatsappContacts(campaignContactList)
    }

    return data
    
  } catch(error: any) {
    logger.error(`Create Campaign API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create campaign")
  }
})