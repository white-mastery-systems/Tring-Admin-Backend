import { errorResponse } from '~/server/response/error.response'
import { checkBucketNameExists } from '~/server/utils/db/contact-list'

const zodUpdateContactList = z.object({
  name: z.string().optional(),
})

export default defineEventHandler(async (event) => {
   const organizationId = (await isOrganizationAdminHandler(event)) as string

   const { id: contactListId} = await isValidRouteParamHandler(event, checkPayloadId("id"))

   const body: any = await isValidBodyHandler(event, zodUpdateContactList)

   const bucketDetail: any = await getContactListById(contactListId)

   const isAlreadyExists = await checkBucketNameExists(organizationId, body?.name, bucketDetail?.type, contactListId)
   if(isAlreadyExists) return errorResponse(event, 400, "Bucket name already exists")
 
   const update = await updateContactList(contactListId, body)

   return update;
})