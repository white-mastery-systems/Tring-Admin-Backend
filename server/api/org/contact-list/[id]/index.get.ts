import { contactListContactsSchema } from "~/server/schema/admin"

const db = useDrizzle()

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event)

  const { id: contactListId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
  
  const data = await db.query.contactListContactsSchema.findMany({
    with: {
      contacts: true
    },
    where: eq(contactListContactsSchema.contactListId, contactListId)
  })

   return data
})