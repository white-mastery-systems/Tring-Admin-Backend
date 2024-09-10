import { getContacts } from "~/server/utils/db/contacts"

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
  
  const data = await getContacts(organizationId, contactListId)

  return data
})