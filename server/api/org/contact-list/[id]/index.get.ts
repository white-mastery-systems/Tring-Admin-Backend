import { getContactsByChatBucketId, getContactsByVoiceBucketId } from "~/server/utils/db/contact-list"

const zodQueryValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event)

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const query = await isValidQueryHandler(event, zodQueryValidator)

  const bucketDetail = await getContactListById(contactListId)

  const type = bucketDetail?.type
  
  const data = type === "chat" 
  ? await getContactsByChatBucketId(contactListId, query)
  : await getContactsByVoiceBucketId(contactListId, query)

  let page, offset, limit = 0
    
  if(query?.page && query?.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }
  
  if(query?.page && query?.limit) {
    const paginatedContacts = data.slice(offset, offset + limit); 
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length/ limit) || 1,
      totalCount: data.length,
      data: {
        name: bucketDetail?.name,
        type: bucketDetail?.type,
        contacts: paginatedContacts
      } 
    }
  } else {
      return {
        name: bucketDetail?.name,
        type: bucketDetail?.type,
        contacts: data
      }
  }
})