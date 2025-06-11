import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { deleteContactFromContactGroup } from "~/server/utils/v2/db/contact-group"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    
    const { id: contactGroupId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const query = await isValidQueryHandler(event, z.object({
      contactId: z.string(),
    }))

    const data = await deleteContactFromContactGroup(contactGroupId, query.contactId)

    return isValidReturnType(event, data)
  } catch (error: any) {
    logger.error(`Delete Contact from contact-group API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to delete contact from contact-group")
  }
})