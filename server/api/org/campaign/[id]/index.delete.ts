import { logger } from "~/server/logger"

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await deleteCampaign(campaignId)
  logger.info(`Campaign deleted successfully, campaign_id: ${campaignId}`)
  return data
})