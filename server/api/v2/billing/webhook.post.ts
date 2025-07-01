import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getuserDetailByEmail } from "~/server/utils/db/user"
import { updateSubscriptionPlanUsageById } from "~/server/utils/v2/db/planUsage"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query: any = await getQuery(event)
    
    let botType : "chat" | "voice"
    
    const getBotType = await getPricingInformation(query.planCode)
    botType = getBotType?.type === "chatbot" ? "chat" : "voice"

    logger.info(`Zoho-billing webhook - ${body.event_type}---${JSON.stringify(body)}`)
    if (!body.data.subscription?.customer?.email) return 

    const userDetails = await getuserDetailByEmail(body?.data.subscription.customer.email)
    if(!userDetails) return

    const orgId = userDetails?.organizationId!
    const subscriptionBody = body?.data?.subscription
    const subscriptionStartDate = new Date(subscriptionBody?.current_term_starts_at) || new Date(subscriptionBody?.updated_time)

    if(body.event_type === "subscription_created") {
      const subscriptionEndDate = new Date(subscriptionBody?.current_term_ends_at) || new Date(subscriptionBody?.expires_at)
      
      const orgZohoSubscription = await isOrgZohoSubscriptionExists(orgId, botType)
      if(!orgZohoSubscription?.subscriptionId) {
        const orgSubscription = {
          organizationId: orgId,
          serviceType: botType,
          subscriptionId: subscriptionBody?.subscription_id,
          pricingPlanCode: subscriptionBody?.plan.plan_code,
          startDate: subscriptionStartDate,
          endDate: subscriptionEndDate,
          subscriptionStatus: subscriptionBody?.status === "trial" ?  "trial"  : "active" as "active",
          originalSubscriptionStatus: subscriptionBody?.status  === "trial" ?  "trial"  : "active" as "active",
        }
            
        const planCode = ( botType === "chat" )
          ? { planCode: orgSubscription.pricingPlanCode}
          : { voicePlanCode : orgSubscription.pricingPlanCode }
         
        await Promise.all([
          orgZohoSubscription
            ? updateOrgZohoSubscription(orgId, botType, orgSubscription)
            : createOrgZohoSubscription(orgSubscription),
          updateOrganization(orgId, { ...planCode }),
          updateUserDetailById(userDetails?.id, { customerId: subscriptionBody?.customerId }),
          createSubscriptionPlanUsage(orgSubscription)
        ])

      }
    } else if(body.event_type === "subscription_reactivated" || body.event_type === "subscription_renewed") {
      const subscriptionEndDate = new Date(subscriptionBody?.current_term_ends_at) || new Date(subscriptionBody?.next_billing_at)

      const orgZohoSubscription = await isOrgZohoSubscriptionExists(orgId, botType)
      const orgSubscription: any = {
        organizationId: orgId,
        serviceType: botType,
        subscriptionId: subscriptionBody?.subscription_id,
        pricingPlanCode: subscriptionBody?.plan.plan_code,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
        subscriptionStatus: subscriptionBody?.status === "trial" ?  "trial"  : "active" as "active",
        originalSubscriptionStatus: subscriptionBody?.status  === "trial" ?  "trial"  : "active" as "active",
      }
            
      const planCode = ( botType === "chat" )
        ? { planCode: orgSubscription.pricingPlanCode }
        : { voicePlanCode : orgSubscription.pricingPlanCode }
      
      const planUsage = await getOrgPlanUsage(orgId, botType)
      if(planUsage) {
         await updateSubscriptionPlanUsageById(planUsage.id, { subscriptionStatus: "inactive" })
      }
       
      await Promise.all([
        orgZohoSubscription
          ? updateOrgZohoSubscription(orgId, botType, orgSubscription)
          : createOrgZohoSubscription(orgSubscription),
        updateOrganization(orgId, { ...planCode }),
        updateUserDetailById(userDetails?.id, { customerId: subscriptionBody?.customerId }),
        createSubscriptionPlanUsage(orgSubscription)
      ]) 
    } else if (body.event_type === "subscription_cancelled" || body.event_type === "subscription_expired") {
        body.event_type === "subscription_cancelled" 
          ? await updateOrgZohoSubscription(orgId, botType, { subscriptionStatus: "cancelled" })
          : await updateOrgZohoSubscription(orgId, botType, { subscriptionStatus: "inactive" })

    } else if (body.event_type === "billing_date_changed") {
      const subscriptionEndDate = new Date(subscriptionBody?.next_billing_at)

      const planUsage: any = await getOrgPlanUsage(orgId, botType)
      await Promise.all([
        updateOrgZohoSubscription(orgId, botType, { endDate: subscriptionEndDate }),
        updateSubscriptionPlanUsageById(planUsage?.id, { endDate: subscriptionEndDate }),
      ])
    } else if (body?.event_type === "subscription_deleted") {
      const planUsage: any = await getOrgPlanUsage(orgId, botType)
      const subscriptionData: any = { 
        subscriptionStatus: "inactive",
        subscriptionId: null
      }
      await Promise.all([
        updateOrgZohoSubscription(orgId, botType, subscriptionData),
        updateSubscriptionPlanUsageById(planUsage?.id, subscriptionData),
      ])
    }
    logger.info(`Zoho-billing ${body.event_type} from zoho billing webhook`)
    return true
  } catch(error: any) {
    logger.error(`Zoho-billing webhook API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to perform zoho-billing webhook actions")
  }
})