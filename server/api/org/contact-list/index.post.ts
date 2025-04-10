import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { checkBucketNameExists, createContactList } from "~/server/utils/db/contact-list";

const zodInsertContactList = z.object({
   name: z.string(),
   organizationId: z.string().optional(),
   type: z.string(),
   crmSyncEnabled: z.boolean().optional(),
   integrationId: z.string().optional(),
   module: z.enum(["leads", "contacts", "both"]).optional(),
   isDefault: z.boolean().optional()
  }).superRefine((data, ctx) => {
    if (data.crmSyncEnabled === true) {
      if (!data.integrationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "integrationId is required when crmSyncEnabled is true",
          path: ["integrationId"],
        });
      }
      if (!data.module) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "module is required when crmSyncEnabled is true",
          path: ["module"],
        });
      }
    }
});

export default defineEventHandler(async (event) => {
  try {
   const body = await isValidBodyHandler(event, zodInsertContactList)
   const organizationId = event?.context?.user?.organizationId ?? body?.organizationId

   const isAlreadyExists = await checkBucketNameExists(organizationId, body?.name, body?.type)
   if(isAlreadyExists) return errorResponse(event, 400, "Bucket name already exists")
     
   const data: any = await createContactList({
     ...body,
     organizationId,
   })

   if(data?.crmSyncEnabled && data?.integrationId && data?.module) {
      const integrationData = await getIntegrationById(organizationId, body?.integrationId!)
      const crmData = []
      const { type, module, id: bucketId } = data

      if (module === "leads" || module === "both") {
        const leadPromise = newGetLeadOrContactsFromZohoCrm({ integrationData, module: "leads" });
        crmData.push(leadPromise);
      }

      if (module === "contacts" || module === "both") {
        const contactPromise = newGetLeadOrContactsFromZohoCrm({ integrationData, module: "contacts" });
        crmData.push(contactPromise);
      }

      const results = await Promise.all(crmData);
      const [leadData = [], contactData = []] = results;
      const combinedData = [...leadData, ...contactData];

      if(combinedData.length === 0) {
        logger.info(`No data found in Zoho CRM - ${integrationData?.id}`)
        return data
      }

      const mappedData = combinedData.map((item) => {
        const crmPhoneOrMobile = item.Mobile || item.Phone;
        const phoneNumber = crmPhoneOrMobile.startsWith('+') ? crmPhoneOrMobile : `+${crmPhoneOrMobile}`
        const phoneNumberDetail = getCountryCodeFromMobileNumber(phoneNumber)

        const commonData = {
          organizationId,
          countryCode: `+${phoneNumberDetail?.data?.countryCallingCode}`,
          phone: phoneNumberDetail?.data?.nationalNumber,
        };

        if (type === 'chat') {
          return {
            ...commonData,
            firstName: item?.First_Name,
            lastName: item?.Last_Name,
            email: item?.Email,
          };
        } else if (type === 'voice') {
          return {
            ...commonData,
            name: item?.First_Name,
          };
        }
      })

      const contactFilePhoneNumbers = mappedData.map((item: any) => item.phone)

      // Fetch existing contacts from the database
      const filterContactsByPhone = type === 'chat' ? filterChatContactsByPhone : filterVoiceContactsByPhone;
      const dbContactList = await filterContactsByPhone(organizationId, contactFilePhoneNumbers);
      
      // Extract phone numbers from the fetched contactList
      const existingDbContacts = new Set(dbContactList.map((contact) => contact.phone));   
      
      // Filter out new contacts that don't exist in the database
      const newContacts = mappedData.filter((item: any) => !existingDbContacts.has(item.phone))
      if (newContacts.length) {
        const createContactsFn = type === 'chat' ? createContacts : createVoicebotContacts;
        await createContactsFn(newContacts);
      }

      // Fetch all contacts again after insertion
      const allDbContactList = await filterContactsByPhone(organizationId, contactFilePhoneNumbers);
      const contactIds = allDbContactList.map((item) => item.id);

      // Fetch existing bucket-contact links
      const findExistingContactsLink = type === 'chat' ? findExistingChatContactsLink : findExistingVoiceContactsLink;
      const existingBucketContactsLink = await findExistingContactsLink(data?.id);

      const existingBucketContactIds = new Set(existingBucketContactsLink.map((item) => item.contactId));

       // Prepare unique contacts data for linking
      const uniqueContactsData = contactIds
        .filter((contact: any) => !existingBucketContactIds.has(contact))
        .map((item: any) => ({
           contactListId: bucketId,
           contactId: item,
           organizationId,
      }))
      
      if(!uniqueContactsData?.length) return errorResponse(event, 400, "No unique phonenumbers to import")
      
      // Create bucket-contact links
      const createContactBucketLink = type === 'chat' ? createChatContactBucketLink : createVoiceContactBucketLink;
      await createContactBucketLink(uniqueContactsData);

      // If type is 'voice', handle campaign scheduling
      if (type === 'voice') {
        const campaignData: any = await getVoiceBucketCampaignId(data?.id);
        if (campaignData) {
          const mapVoiceContactWithScheduler = uniqueContactsData.map((unique) => ({
            campaignId: campaignData.id,
            bucketId: unique.contactListId,
            contactId: unique.contactId,
            botId: campaignData?.botConfig?.botId,
            organizationId: unique.organizationId,
          }));
          await createVoicebotSchedular(mapVoiceContactWithScheduler);
        }
      }
   }
   return isValidReturnType(event, data)
  } catch (error: any) {
    logger.error(`Bucket create API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(error, 500, "Unable to create a bucket")
  }
})