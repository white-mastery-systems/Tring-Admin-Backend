import { deleteVoicebotContacts } from "~/server/utils/db/contacts"

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const query = await isValidQueryHandler(event, z.object({
    type: z.string()
  }))
  
  const { contactId } = await isValidRouteParamHandler(event, checkPayloadId("contactId"))
  
  const data = query.type === "chat"
   ? await deleteContacts(contactId)
   : await deleteVoicebotContacts(contactId)

  return data
})