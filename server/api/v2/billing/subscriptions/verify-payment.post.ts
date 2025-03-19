import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response";
import { updateUserDetailById } from "~/server/utils/db/user";
import { getZohoBillingHostedPageDetails } from "~/server/utils/v2/billing/module";
import { createSubscriptionPlanUsage, getOrgPlanUsage, updateSubscriptionPlanUsage } from "~/server/utils/v2/db/planUsage";
import { createOrgZohoSubscription, isOrgZohoSubscriptionExists, updateOrgZohoSubscription } from "~/server/utils/v2/db/zohoSubscription";

const zodSubscriptionVerifyPayment = z.object({
   hostedpageId: z.string()
})

export default defineEventHandler(async (event)=>{
  try {
    const orgId = (await isOrganizationAdminHandler(event) as string);
    const userId = event.context.user?.id
    if (!userId) {
      return errorResponse(event, 400, "User Not Found: The specified user could not be found. Please check the user ID.")
    }

    const body = await isValidBodyHandler(event, zodSubscriptionVerifyPayment)

    const adminConfig = await getAdminConfig()

    const hostedPageData = await getZohoBillingHostedPageDetails(body.hostedpageId, adminConfig?.metaData)
    let botType: "chat" | "voice"
  
    const getBotType = await getPricingInformation(hostedPageData?.data.subscription.plan.plan_code)
    botType = getBotType?.type === "chatbot" ? "chat" : "voice"

    const subscriptionStartDate = new Date(hostedPageData?.data?.subscription?.current_term_starts_at) || new Date(hostedPageData?.data?.subscription?.updated_time)
    const subscriptionEndDate = new Date(hostedPageData?.data?.subscription?.current_term_ends_at) || new Date(hostedPageData?.data?.subscription?.expires_at)

    const orgSubscription = {
      organizationId: orgId!,
      serviceType: botType,
      subscriptionId: hostedPageData?.data?.subscription?.subscription_id,
      pricingPlanCode: hostedPageData?.data?.subscription?.plan.plan_code,
      startDate: subscriptionStartDate,
      endDate: subscriptionEndDate,
      subscriptionStatus: hostedPageData?.data?.subscription?.status === "trial" ? "trail" : "active" as "active"
    }
    
    const planCode = ( botType === "chat" )
      ? { planCode: orgSubscription.pricingPlanCode}
      : { voicePlanCode : orgSubscription.pricingPlanCode }
     
    const orgZohoSubscription = await isOrgZohoSubscriptionExists(orgId, botType)
    const planUsage = await getOrgPlanUsage(orgId, botType)
    
    if(planUsage) {
      await updateSubscriptionPlanUsage(orgId, botType, { subscriptionStatus: "inactive" })
    }
  
    await Promise.all([
      orgZohoSubscription
        ? updateOrgZohoSubscription(orgId, botType, orgSubscription)
        : createOrgZohoSubscription(orgSubscription),
      updateOrganization(orgId, { ...planCode }),
      updateUserDetailById(userId, { customerId: hostedPageData?.data?.subscription?.customerId }),
      createSubscriptionPlanUsage(orgSubscription)
    ])

   return { status: "Subscription Payment Successful" }
  } catch (error: any) {
    logger.error(`Subscription verify payment API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to verify the subscription payment")
  }
})