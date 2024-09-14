import { listNumberIntegration } from "~/server/utils/db/number-integration"

const zodQueryvalidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const query = await isValidQueryHandler(event, zodQueryvalidator)

  const list = await listNumberIntegration(organizationId, query)
  return list
})