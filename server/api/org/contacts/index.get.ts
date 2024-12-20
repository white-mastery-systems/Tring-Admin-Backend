import { getContacts, getVoicebotContacts } from "~/server/utils/db/contacts"

const zodQueryvalidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
  type: z.string()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const query = await isValidQueryHandler(event, zodQueryvalidator)
  
  const data =  query.type === "chat" 
  ? await getContacts(organizationId, query)
  : await getVoicebotContacts(organizationId, query)

  return data
})