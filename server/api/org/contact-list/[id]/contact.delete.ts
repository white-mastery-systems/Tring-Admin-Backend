import { deleteChatContactFromBucket, deleteVoiceContactFromBucket } from "~/server/utils/db/contact-list"

const db = useDrizzle()

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event)

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const bucketDetail = await getContactListById(contactListId)

  const body = await isValidBodyHandler(event, z.object({ contactId: z.string() }))

  const data = bucketDetail?.type === "chat"
   ? await deleteChatContactFromBucket(contactListId, body.contactId)
   : await deleteVoiceContactFromBucket(contactListId, body.contactId)
   
  return data
})