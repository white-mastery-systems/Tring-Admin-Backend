import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { deleteChatImprovementById } from "~/server/utils/db/chats"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const { queryId } = await isValidRouteParamHandler(event, checkPayloadId("queryId"))

    const data = await deleteChatImprovementById(queryId)

    return isValidReturnType(event, data)
  } catch (error: any) {
    logger.error(`Delete Chat Improvement API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to delete chat improvement")
  }
})