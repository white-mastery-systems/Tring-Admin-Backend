import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  try {
    const crmData = await readBody(event);
    const { bucketId } = await isValidQueryHandler(event, z.object({ 
      bucketId: z.string(),
    }));

    logger.info(`Zoho-CRM Webhook received:, ${JSON.stringify(crmData) , bucketId}`);

    // return crmData
    const bucketDetail = await getContactListById(bucketId);
    const organizationId = bucketDetail?.organizationId;
    if (!organizationId) {
      return errorResponse(event, 400, "Invalid bucket or organization ID");
    }

    const isChat = bucketDetail?.type === "chat";
    const isVoice = bucketDetail?.type === "voice";

    const crmPhoneOrMobile = crmData.Mobile || crmData.Phone;

    const phoneNumber = crmPhoneOrMobile.startsWith('+') ? crmPhoneOrMobile : `+${crmPhoneOrMobile}`;
    const phoneNumberDetail = getCountryCodeFromMobileNumber(phoneNumber);
    
    const countryCode = `+${phoneNumberDetail?.data?.countryCallingCode}`;
    const phone = phoneNumberDetail?.data?.nationalNumber;

    const contactBody = isChat
    ? {
        firstName: crmData?.First_Name,
        lastName: crmData?.Last_Name,
        email: crmData?.Email,
        countryCode,
        phone,
        organizationId,
      }
    : {
        name: crmData?.First_Name,
        countryCode,
        phone,
        organizationId,
      };
    
    const checkContactFn = isChat ? checkChatContacts : checkVoiceContacts;
    const createContactFn = isChat ? createContacts : createVoicebotContacts;
    const getLinkFn = isChat ? getSingleChatContactLink : getSingleVoiceContactLink;
    const updateContactFn = isChat ? updateContacts : updateVoicebotContacts;
    const createLinkFn = isChat ? createChatContactBucketLink : createVoiceContactBucketLink;

    let contact = await checkContactFn(organizationId, phone);
    if (!contact) {
      contact = await createContactFn(contactBody);
    }

    const isAlreadyMapped = await getLinkFn(bucketId, contact?.id);
    if (isAlreadyMapped) {
      logger.info("Phone number already linked with this bucket");
      await updateContactFn(isAlreadyMapped?.contactId, contactBody);
      return errorResponse(event, 400, "Phone number already linked with this bucket");
    }
  
    const contactLinkData = {
      contactListId: bucketId,
      contactId: contact.id,
      organizationId,
    };
    await createLinkFn(contactLinkData);

    if(isVoice) {
      const campaignData: any = await getVoiceBucketCampaignId(bucketId);
      if(campaignData) {
        const schedularData = {
          campaignId: campaignData.id,
          bucketId,
          contactId: contact.id,
          botId: campaignData?.botConfig?.botId,
          organizationId,
        };
        await createVoicebotSchedular(schedularData);
      }
    }

    return true
  } catch (error) {
    logger.error("Error in webhook handler:", error);
    return errorResponse(event, 500, "Internal Server Error")
  }
})