import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, z.object({
      hostedpageId: z.string()
    }))

    const adminConfig = await getAdminConfig()
    let botType : "chat" | "voice"
    
    const hostedPageData = await getZohoBillingHostedPageDetails(query.hostedpageId, adminConfig?.metaData)

    if(!hostedPageData?.data?.subscription) {
      return errorResponse(event, 500, "Failed to retrieve client details from Zoho Billing Hostedpage Id. Please try again.")
    }
    
    const subscriptionData = hostedPageData?.data?.subscription

    const zohoCustomerDetail = subscriptionData?.customer
    const userDetails = await getuserDetailByEmail(zohoCustomerDetail?.email)
    if(userDetails) {
      return errorResponse(event, 500, "user already exists")
    }
    const pricingInfo = await getPricingInformation(subscriptionData.plan.plan_code)
    botType = pricingInfo?.type === "chatbot" ? "chat" : "voice"

    // Organization creation
    const planCode = ( botType === "chat" )
      ? { planCode: pricingInfo?.planCode}
      : { voicePlanCode : pricingInfo?.planCode }

    const org = await createOrganization({ 
      ...planCode,
      name: zohoCustomerDetail?.company_name || ""
    })

    // User creation
    const contactPersonDetail = subscriptionData?.contactpersons.find((i: any) => i.email === zohoCustomerDetail?.email)
    const billingAddress = zohoCustomerDetail?.billing_address
    const userCountry = phoneLength.find((i) => i.label === zohoCustomerDetail?.billing_address?.country)
    const userDetail = {
      role: "admin" as const,
      username: zohoCustomerDetail?.first_name,
      mobile: contactPersonDetail?.mobile,
      countryCode: `+${userCountry?.phone}`,
      email: zohoCustomerDetail?.email,
      address: {
        country: billingAddress?.country,
        city: billingAddress?.city,
        state: billingAddress?.state,
        street: billingAddress?.state,
        zipCode: billingAddress?.zip
      },
      customerId: zohoCustomerDetail?.customer_id,
      organizationId: org.id,
      isVerified: true,
      password: "123456",
      isCreatedByZohoBilling: true,
    }

    // subscription creation
    const subscriptionStartDate = new Date(subscriptionData?.current_term_starts_at) || new Date(subscriptionData?.updated_time)
    const subscriptionEndDate = new Date(subscriptionData?.current_term_ends_at) || new Date(subscriptionData?.expires_at)

      const subscription = [{
        organizationId: org.id,  
        serviceType: botType,
        subscriptionId: subscriptionData?.subscription_id,
        pricingPlanCode: pricingInfo?.planCode,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
        subscriptionStatus: "active" as "active"
      }, {
        organizationId: org.id,
        serviceType: botType === "chat" ? "voice" : "chat",
        pricingPlanCode: botType === "chat" ? "voice_free" : "chat_free",
        subscriptionStatus: "active"
      }]

    const userCreation = await createUser(userDetail)

    // Subscription creation
    await Promise.all([
      createContactList({
        name: "leads contacts",
        organizationId: org.id,
        isDefault: true,
      }),
      createOrgZohoSubscription(subscription),
      createSubscriptionPlanUsage({
        organizationId: org.id,
        serviceType: botType,
        subscriptionId: subscriptionData?.subscription_id,
        pricingPlanCode: pricingInfo?.planCode!,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
        subscriptionStatus: "active"
      })
    ])
    if(!userCreation) {
      return errorResponse(event, 500, "Failed to store client data. Please contact support.")
    }
    logger.info(`Client onboarding successful via hosted page: OrganizationId: ${org.id}`)
    return { userId: userCreation?.id }
  } catch (error: any) {
    logger.error(`Client onboaring via hostedPage id API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Onboarding via hostedpage id is failed")
  }
})