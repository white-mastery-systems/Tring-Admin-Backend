import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { queryId } = await isValidRouteParamHandler(event, checkPayloadId("queryId"))
 
    const botQueries = await getBotQueriesById(queryId)
 
    return botQueries
  } catch (error: any) {
    logger.error(`Get chatbot queries by id API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch queries")
  }
})