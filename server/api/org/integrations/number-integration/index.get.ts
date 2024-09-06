import { listNumberIntegration } from "~/server/utils/db/number-integration"

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const list = await listNumberIntegration(organizationId)
  return list
})