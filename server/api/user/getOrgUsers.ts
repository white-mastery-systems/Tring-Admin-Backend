import { getOrgUsers } from "~/server/utils/db/user"

const zodQueryValidator = z.object({
  query: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const query = await isValidQueryHandler(event, zodQueryValidator)

  const data = await getOrgUsers(organizationId, query)

  return data
})