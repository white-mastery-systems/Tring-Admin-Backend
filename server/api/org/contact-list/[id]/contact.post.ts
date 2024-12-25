import { errorResponse } from "~/server/response/error.response"
import { zodChatContacts, zodVoiceContacts } from "../../contacts/index.post"
import { getSingleChatContactLink, getSingleVoiceContactLink } from "~/server/utils/db/contact-list"
import { getVoiceBucketCampaignId } from "~/server/utils/db/campaign"

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const bucketDetail = await getContactListById(contactListId)
  
  const body = await isValidBodyHandler(event, bucketDetail?.type === "chat" ? zodChatContacts : zodVoiceContacts)
    
  let checkContactDetail = bucketDetail?.type === "chat"
    ? await checkChatContacts(organizationId, body.phone)
    : await checkVoiceContacts(organizationId, body.phone)

  if(!checkContactDetail) { 
    checkContactDetail = bucketDetail?.type === "chat" 
      ? await createContacts({
        ...body,
        organizationId: organizationId,
      }) 
      : await createVoicebotContacts({
        ...body,
        organizationId: organizationId,
    })
  } 

  const isAlreadyMapped = bucketDetail?.type === "chat" 
    ? await getSingleChatContactLink(contactListId, checkContactDetail?.id)
    : await getSingleVoiceContactLink(contactListId, checkContactDetail?.id)

  if(isAlreadyMapped) return errorResponse(event, 400, "Phone number already linked with this bucket")

  const data = {
    contactListId: contactListId,
    contactId: checkContactDetail.id,
    organizationId,
  }

  if(bucketDetail?.type === "chat") {
    await createChatContactBucketLink(data)
  } else {
    await createVoiceContactBucketLink(data)

    // check campaign data
    const campaignData = await getVoiceBucketCampaignId(contactListId)
    if(campaignData) {  
      const mapVoiceContactWithSchedular = {
        campaignId: campaignData.id,
        bucketId: contactListId!,
        contactId: checkContactDetail.id,
        botId: campaignData?.botConfig?.botId,
        organizationId: organizationId,
      }
      // create campaign data in schedular table
      await createVoicebotSchedular(mapVoiceContactWithSchedular)
    } 
  }
   
  return true
})