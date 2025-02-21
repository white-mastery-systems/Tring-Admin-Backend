import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import momentTz from "moment-timezone"

const zodPlanUsageUpdateValidation = z.object({
   organizationId: z.string()
})

const findUTCDate = (orgZohoSubscription: any) => {
  return {
    startDate: orgZohoSubscription?.startDate ?? momentTz().utc().toDate(),
    endDate: orgZohoSubscription.endDate ?? momentTz().utc().toDate(),
  };
}

export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, zodPlanUsageUpdateValidation)
    const organizationId = query?.organizationId
    
    const [orgDetail, orgZohoSubscription, orgPlanUsage] = await Promise.all([
      getOrganizationById(organizationId),
      getOrgZohoSubscription(organizationId, "chat"),
      getOrgPlanUsage(organizationId, "chat")
    ])

    if(!orgPlanUsage || orgZohoSubscription?.subscriptionStatus !== "active") {
      return false // subscription status is not active
    }

    const planPricingDetail = await getSubcriptionPlanDetailByPlanCode(orgZohoSubscription?.pricingPlanCode!)

    let usedSessions = orgPlanUsage?.interactionsUsed || 0
    const maxSessions = planPricingDetail?.sessions || 0
    const wallet = orgDetail?.wallet || 0
    
    const availableSessions = Math.max(maxSessions - usedSessions, 0)

    //TODO
    if(usedSessions >= maxSessions) {
      if(wallet > 0) {
        const updatedInteractions = await updateSubscriptionPlanUsage(
          orgPlanUsage.id,
          { interactionsUsed: (orgPlanUsage?.interactionsUsed || 0) + 1 }
        )
        usedSessions = updatedInteractions?.interactionsUsed || 0
        const extraSession = Math.max(usedSessions - maxSessions, 0)
        const actualExtraSessions = Math.max(extraSession - orgPlanUsage.extraInteractionsUsed!, 0)
        if(actualExtraSessions > 0) {
          const extraSessionCost = actualExtraSessions * planPricingDetail?.extraSessionCost!
          const currentWallet = Math.max(0, parseFloat((wallet - extraSessionCost).toFixed(2)))
          await updateSubscriptionPlanUsage(orgPlanUsage?.id!, {
            extraInteractionsUsed: extraSession
          })
          await updateOrganization(organizationId, { wallet: currentWallet })
          if(currentWallet <= 0) {
            await updateOrgZohoSubscription(organizationId, "chat", { subscriptionStatus: "inactive"})
            return false
          }
          return true
        } 
      } else {
        await updateOrgZohoSubscription(organizationId, "chat", { subscriptionStatus: "inactive"})
        // await updateChatbotStatus(organizationId)
        return false
      }
    }

    const updatedInteractions = await updateSubscriptionPlanUsage(
      orgPlanUsage.id!,
      { interactionsUsed: (orgPlanUsage?.interactionsUsed || 0) + 1 }
    )
    if(updatedInteractions?.interactionsUsed === maxSessions) {
      await updateOrgZohoSubscription(organizationId, "chat", { subscriptionStatus: "inactive"})
    }
    return true
  } catch (error: any) {
    logger.error(`Chat session usage update API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update the chat plan usages")
  }
})