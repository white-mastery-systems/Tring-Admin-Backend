import { errorResponse } from "~/server/response/error.response"
import { zodChatContacts, zodVoiceContacts } from "../../contacts/index.post"
import { getSingleChatContactLink, getSingleVoiceContactLink } from "~/server/utils/db/contact-list"

const db = useDrizzle()

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

  bucketDetail?.type === "chat" 
    ? await createChatContactBucketLink(data)
    : await createVoiceContactBucketLink(data)

  return true
})