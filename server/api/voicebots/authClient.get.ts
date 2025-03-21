import momentTz from "moment-timezone"
import { errorResponse } from "~/server/response/error.response";
import { getVoicebotDetailByPhoneNumber, orgVoicebotSubscription } from "~/server/utils/db/voicebots";
import { updateSubscriptionPlanUsageById } from "~/server/utils/v2/db/planUsage";

export default defineEventHandler(async (event) => {
  const query = await isValidQueryHandler(event, z.object({
    phoneNumber: z.any()
  }))
  
  const incomingPhoneNumber = (`+${query.phoneNumber}`).replace(/\s+/g, "")

  const voiceBotDetail: any = await getVoicebotDetailByPhoneNumber(incomingPhoneNumber)

  if (!voiceBotDetail) return errorResponse(event, 400, "Mobile number does not exist")
  
  if (!voiceBotDetail.active) return errorResponse(event, 400, "Bot is not active")
      
  const organizationId = voiceBotDetail?.organizationId

  // check the plan-code of the orgaination
  const [voicebotPlan, voicePlanUsage, orgDetail, adminDetail ] = await Promise.all([
    getOrgZohoSubscription(organizationId, "voice"),
    getOrgPlanUsage(organizationId, "voice"),
    getOrganizationById(organizationId),
    getAdminByOrgId(organizationId)
  ]) 

  // console.log({ voicebotPlan })
  if (voicebotPlan?.pricingPlanCode === "voice_free") {
    return errorResponse(event, 500, "This user was a free plan")
  }

  if(voicebotPlan?.subscriptionStatus !== "active") {
    return errorResponse(event, 500, "Subscription status is inactive")
  }
  //TODO - add extra and normal quota validation
  
  // calculate total minutes for current month
  const currentDate = momentTz().utc().toDate()
  const currentMonthEndDate = momentTz(voicebotPlan?.endDate).utc().toDate()

  // get actual voicebot pricing information
  const adminCountry = adminDetail?.address?.country!
  const voicePricingInformation = await getSubcriptionPlanDetailByPlanCode(voicebotPlan?.pricingPlanCode, adminCountry)

  const usedCallMinutes = voicePlanUsage?.interactionsUsed || 0 
  const maxCallMinutes = voicePricingInformation?.sessions || 0
  let extraMinutes = 0
  const orgWalletMinutes = orgDetail?.wallet || 0

  if(currentDate > currentMonthEndDate) {
    await updateOrgZohoSubscription(organizationId, "voice", { subscriptionStatus: "inactive" })
    return errorResponse(event, 500, "Subscription plan has expired")
  }

  if(usedCallMinutes >= maxCallMinutes) {
    if(orgWalletMinutes > 0) {
      extraMinutes = Math.max(usedCallMinutes - maxCallMinutes, 0)
      const actualExtraMinutes = Math.max(extraMinutes - voicePlanUsage?.extraInteractionsUsed!, 0)
      if(actualExtraMinutes > 0) {
        const extraMinutesAmount = actualExtraMinutes * voicePricingInformation?.extraSessionCost!;
        const currentWallet =  Math.max(0, parseFloat((orgWalletMinutes - extraMinutesAmount).toFixed(2)))
        await updateSubscriptionPlanUsageById(voicePlanUsage?.id!, {
          extraInteractionsUsed: extraMinutes
        })
        await updateOrganization(organizationId, { wallet: currentWallet })
        if(currentWallet <= 0) {
          await updateOrgZohoSubscription(organizationId, "voice", { subscriptionStatus: "inactive" })
          return errorResponse(event, 500, "Wallet Balance Exhausted")
        } 
      }
    } else {
      await updateOrgZohoSubscription(organizationId, "voice", { subscriptionStatus: "inactive" })
      return errorResponse(event, 500, "Exceeded the allowed call minutes")
    }
  }
  
  return voiceBotDetail
});
