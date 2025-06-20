import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    
    const data = await deleteNewCampaignById(campaignId)
    logger.info(`Campaign Deleted Successfully - campaignId: ${campaignId}`)
    return data
  } catch (error: any) {
    logger.error(`Campaign Delete API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to delete campaign")
  }
})