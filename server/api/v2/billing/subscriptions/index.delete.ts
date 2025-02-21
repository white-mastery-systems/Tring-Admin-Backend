import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { cancelZohoSubscription } from "~/server/utils/v2/billing/subscription"
import { zodBotTypeQuery } from "~/server/utils/validations"

export default defineEventHandler(async (event) => {
  try {
    const orgId = (await isOrganizationAdminHandler(event)) as string
    const query = await isValidQueryHandler(event, zodBotTypeQuery)

    const orgZohoSubscription = await getOrgZohoSubscription(orgId, query.type)
    const adminConfig = await getAdminConfig()

    await cancelZohoSubscription(orgZohoSubscription?.subscriptionId, adminConfig?.metaData)

    await updateOrgZohoSubscription(orgId, query.type, { subscriptionStatus: "cancelled"})
    // updateChatbotStatus(orgId),
    logger.info(`Zoho-billing subscription cancelled from admin panel - organizationId: ${orgId}`)
    return true
  } catch (error: any) {
    logger.error(`Zoho-billing cancel subscription API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to cancel the subscription")
  }
})