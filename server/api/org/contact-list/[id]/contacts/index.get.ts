import { getContacts } from "~/server/utils/db/contacts"

const zodQueryvalidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional()
})


export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const query = await isValidQueryHandler(event, zodQueryvalidator)
  
  const data = await getContacts(organizationId, contactListId, query)

  return data
})