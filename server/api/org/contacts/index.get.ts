import { getContacts } from "~/server/utils/db/contacts"

const zodQueryvalidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const query = await isValidQueryHandler(event, zodQueryvalidator)
  
  const data = await getContacts(organizationId, query)

  return data
})