import { getContactLists } from "~/server/utils/db/contact-list"

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const list = await getContactLists(organizationId)

  return list
})