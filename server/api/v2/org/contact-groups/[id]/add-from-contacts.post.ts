import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createContactGroupLinks } from "~/server/utils/v2/db/contact-group"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const { id: contactGroupId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    
    const body = await isValidBodyHandler(event, z.object({
      contactIds: z.string().array(),
    }))

    const existingContactGroupLink = await getContactLinksByContactGroupId(contactGroupId, body?.contactIds)
    
    const existingContactsIds = new Set(existingContactGroupLink.map((i) => i.contactId))
    
    const newContacts = body?.contactIds.filter((i: any) => !existingContactsIds.has(i))
    if(!newContacts.length) {
      return errorResponse(event, 500, "Selected contacts are already linked to this group")
    }
    
    const contactsAndContactGroupsLink: any = newContacts.map((item) => ({
      contactId: item,
      contactGroupId,
      organizationId
    }))
    
    const data = await createContactGroupLinks(contactsAndContactGroupsLink)

    return data
    
  } catch (error: any) {
    logger.error(`Contact Group - Add from contacts API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to add from contacts")
  }
})