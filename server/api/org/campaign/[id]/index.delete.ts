import { logger } from "~/server/logger"

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: campaignId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const data = await deleteCampaign(campaignId)
  logger.info(`Campaign deleted successfully, campaign_id: ${campaignId}, organizationId: ${organizationId}`)
  return data
})