import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import momentTz from "moment-timezone"
import { updateSubscriptionPlanUsageById } from "~/server/utils/v2/db/planUsage"

const zodPlanUsageUpdateValidation = z.object({
   botId: z.string()
})

const findUTCDate = (orgZohoSubscription: any) => {
  return {
    startDate: orgZohoSubscription?.startDate ?? momentTz().utc().toDate(),
    endDate: orgZohoSubscription.endDate ?? momentTz().utc().toDate(),
  };
}

export default defineEventHandler(async (event) => {
  try {
    console.log("inside chat session update API")
    const query = await isValidQueryHandler(event, zodPlanUsageUpdateValidation)
    const botDetail = await getBotDetails(query?.botId)
    const organizationId = botDetail?.organizationId!
    
    const [orgDetail, orgZohoSubscription, orgPlanUsage, adminDetails] = await Promise.all([
      getOrganizationById(organizationId),
      getOrgZohoSubscription(organizationId, "chat"),
      getOrgPlanUsage(organizationId, "chat"),
      getAdminByOrgId(organizationId)
    ])

    if(!orgPlanUsage || orgZohoSubscription?.subscriptionStatus !== "active") {
      return false // subscription status is not active
    }

    const adminCountry = adminDetails?.address.country!

    let planPricingDetail
        
    if(orgZohoSubscription?.pricingPlanCode === "chat_free") {
      planPricingDetail = await getPricingInformation("chat_free")
    } else if(orgZohoSubscription?.subscriptionStatus === "trial") {
      planPricingDetail = await getSubcriptionPlanDetailByPlanCode("chat_intelligence", adminCountry)
    } {
      planPricingDetail = await getSubcriptionPlanDetailByPlanCode(orgZohoSubscription?.pricingPlanCode!, adminCountry)
    }

    let usedSessions = orgPlanUsage?.interactionsUsed || 0
    const maxSessions = planPricingDetail?.sessions || 0
    const wallet = orgDetail?.wallet || 0
    
    const availableSessions = Math.max(maxSessions - usedSessions, 0)

    //TODO
    if(usedSessions >= maxSessions) {
      if(wallet > 0 && orgZohoSubscription?.pricingPlanCode === "chat_free" && orgZohoSubscription.subscriptionStatus !== "trial") {
        const updatedInteractions = await updateSubscriptionPlanUsageById(
          orgPlanUsage.id,
          { interactionsUsed: (usedSessions || 0) + 1 }
        )
        usedSessions = updatedInteractions?.interactionsUsed || 0
        const extraSession = Math.max(usedSessions - maxSessions, 0)
        const actualExtraSessions = Math.max(extraSession - orgPlanUsage.extraInteractionsUsed!, 0)
        console.log({ actualExtraSessions, cost: planPricingDetail?.extraSessionCost! })
        if(actualExtraSessions > 0) {
          const extraSessionCost = actualExtraSessions * planPricingDetail?.extraSessionCost!
          const currentWallet = Math.max(0, parseFloat((wallet - extraSessionCost).toFixed(2)))
          await updateSubscriptionPlanUsageById(orgPlanUsage?.id!, {
            extraInteractionsUsed: extraSession
          })
          await updateOrganization(organizationId, { wallet: currentWallet })
          if(currentWallet <= 0) {
            await updateOrgZohoSubscription(organizationId, "chat", { subscriptionStatus: "inactive"})
          }
          return { status: true }
        }
        return { status: true }
      } else {
        await updateOrgZohoSubscription(organizationId, "chat", { subscriptionStatus: "inactive"})
        // await updateChatbotStatus(organizationId)
        return { status: false }
      }
    }

    const updatedInteractions = await updateSubscriptionPlanUsageById(
      orgPlanUsage.id!,
      { interactionsUsed: (usedSessions || 0) + 1 }
    )
    if(updatedInteractions?.interactionsUsed === maxSessions && wallet <= 0) {
      await updateOrgZohoSubscription(organizationId, "chat", { subscriptionStatus: "inactive"})
    }
    return { status: true }
  } catch (error: any) {
    logger.error(`Chat session usage update API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update the chat plan usages")
  }
})