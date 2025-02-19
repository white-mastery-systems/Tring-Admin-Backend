import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response";
import { updateUserDetailById } from "~/server/utils/db/user";
import { getZohoBillingHostedPageDetails } from "~/server/utils/v2/billing/module";
import { createSubscriptionPlanUsage } from "~/server/utils/v2/db/planUsage";
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
    
    const orgSubscription = {
      organizationId: orgId!,
      serviceType: botType,
      subscriptionId: hostedPageData?.data?.subscription?.subscription_id,
      pricingPlanCode: hostedPageData?.data?.subscription?.plan.plan_code,
      startDate: new Date(hostedPageData?.data?.subscription?.updated_time),
      endDate: new Date(hostedPageData?.data?.subscription?.next_billing_at),
      subscriptionStatus: "active" as "active"
    }
    
    const planCode = ( botType === "chat" )
      ? { planCode: orgSubscription.pricingPlanCode}
      : { voicePlanCode : orgSubscription.pricingPlanCode }
     
    const orgZohoSubscription = await isOrgZohoSubscriptionExists(orgId, botType)

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