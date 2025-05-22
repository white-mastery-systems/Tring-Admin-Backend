import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { deleteContactGroupById } from "~/server/utils/v2/db/contact-group"

export default defineEventHandler(async(event) => {
  try {
    await isOrganizationAdminHandler(event)

    const { id: contactGroupId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const data = await deleteContactGroupById(contactGroupId)

    return isValidReturnType(event, data)

  } catch (error: any) {
    logger.error(`Dlete Contact group by id API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to delete contact group")
  }
})