import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { getVoiceBucketCampaignId } from "~/server/utils/db/campaign";
import { createChatContactBucketLink, createVoiceContactBucketLink, findExistingChatContactsLink, findExistingVoiceContactsLink } from "~/server/utils/db/contact-list";
import { parseContactsFormDataFile } from "~/server/utils/db/contacts";

export default defineEventHandler(async (event) => {
try {
 const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: bucketId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const bucketDetail: any = await getContactListById(bucketId)

  const type = bucketDetail.type!

  const formData = await readMultipartFormData(event);
  if (!formData) return errorResponse(event, 500, "Invalid Data")

  const fileField = formData.find((item) => item.name === "file")
  if (!fileField) return errorResponse(event, 500, "No file uploaded")

  const { filename, data }: any = fileField;
  const ext = filename?.split('.').pop().toLowerCase();
  
  const contactFileData = await parseContactsFormDataFile({ file: data, fileType: ext, queryType: type! })

  if(!contactFileData.length) return errorResponse(event, 500, "Uploaded file is empty")

  const contactFilePhoneNumbers = contactFileData.map((item: any) => type === "chat" ? item.Number : item.Phone)
 
  const dbContactList = type === "chat" 
   ? await filterChatContactsByPhone(organizationId,contactFilePhoneNumbers)
   : await filterVoiceContactsByPhone(organizationId,contactFilePhoneNumbers)

  // Extract phone numbers from the fetched contactList
  const existingDbContacts = dbContactList.map((contact: any) => contact.phone);

  const newContacts = contactFileData.filter((item: any) =>
    !existingDbContacts.includes(type === "chat" ? item.Number : item.Phone)
  )

  if(newContacts.length) {
    const mapNewContactWithOrgId = constructData(newContacts, type, organizationId);
  
    type === "chat"
     ? await createContacts(mapNewContactWithOrgId) 
     : await createVoicebotContacts(mapNewContactWithOrgId)
  }

  const allDbContactList = type === "chat" 
   ? await filterChatContactsByPhone(organizationId,contactFilePhoneNumbers)
   : await filterVoiceContactsByPhone(organizationId,contactFilePhoneNumbers)

  const contactIds = allDbContactList.map((item) => item.id)

  const existingBucketContactsLink = 
   type === "chat"
  ? await findExistingChatContactsLink(bucketId)
  : await findExistingVoiceContactsLink(bucketId)

  const existingBucketContactIds: any = new Set(existingBucketContactsLink.map((item: any) => item.contactId ))

  const uniqueContactsData = contactIds
    .filter((contact: any) => !existingBucketContactIds.has(contact))
    .map((item: any) => ({
       contactListId: bucketId,
       contactId: item,
       organizationId,
  }))

  // console.log({ uniqueContactsData })

  if(!uniqueContactsData?.length) return errorResponse(event, 400, "No unique phonenumbers to import")

  if(type === "chat") {
    await createChatContactBucketLink(uniqueContactsData)
  } else {
    await createVoiceContactBucketLink(uniqueContactsData)

    // check campaign data
    const campaignData = await getVoiceBucketCampaignId(bucketId)
    if(campaignData) {
      const mapVoiceContactWithSchedular = uniqueContactsData.map((unique: any) => {
        return {
          campaignId: campaignData.id,
          bucketId: unique?.contactListId!,
          contactId: unique.contactId,
          botId: campaignData?.botConfig?.botId,
          organizationId: unique.organizationId,
        }
      })
      // create campaign data in schedular table
      await createVoicebotSchedular(mapVoiceContactWithSchedular)
    }
  }
  return true
  } catch (error: any) {
    logger.error(`Import contacts inside the buckets Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to import the file")
  }
})