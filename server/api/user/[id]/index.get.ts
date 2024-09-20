import { getOrgUserById } from "~/server/utils/db/user"

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: orgUserId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await getOrgUserById(orgUserId)

  return data
})