import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { v4 as uuid } from "uuid";

const config = useRuntimeConfig()

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
    const pricingInfo = await getPricingInformation(subscriptionData.plan.plan_code)
    botType = pricingInfo?.type === "chatbot" ? "chat" : "voice"

    // Organization creation
    const planCode = ( botType === "chat" )
      ? { planCode: pricingInfo?.planCode}
      : { voicePlanCode : pricingInfo?.planCode }

    const contactPersonDetail = subscriptionData?.contactpersons.find((i: any) => i.email === zohoCustomerDetail?.email)
    const billingAddress = zohoCustomerDetail?.billing_address
    const userCountry = phoneLength.find((i) => i.label === zohoCustomerDetail?.billing_address?.country)

    let userDetails = await getuserDetailByEmail(zohoCustomerDetail?.email)

    const org = await createOrganization({ 
      ...planCode,
      name: zohoCustomerDetail?.company_name || `${userDetails?.email}'s - Org`,
    })

    if(!userDetails) {
      // User creation
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
          street: billingAddress?.street,
          zipCode: billingAddress?.zip
        },
        customerId: zohoCustomerDetail?.customer_id,
        organizationId: org.id,
        isVerified: true,
        password: "123456",
        isCreatedByZohoBilling: true,
      }
      userDetails = await createUser(userDetail)
    } else {
      userDetails = await updateUserDetailById(userDetails?.id, 
      {
        mobile: contactPersonDetail?.mobile,
        countryCode: `+${userCountry?.phone}`,
        address: {
          country: billingAddress?.country,
          city: billingAddress?.city,
          state: billingAddress?.state,
          street: billingAddress?.street,
          zipCode: billingAddress?.zip
        },
        organizationId: org.id,
        isVerified: true,
        customerId: zohoCustomerDetail?.customer_id
      })
    }

    // subscription creation
    const subscriptionStartDate = new Date(subscriptionData?.current_term_starts_at) || new Date(subscriptionData?.updated_time)
    const subscriptionEndDate = new Date(subscriptionData?.current_term_ends_at) || new Date(subscriptionData?.expires_at)

    const subscription: any = [{
        organizationId: org.id,  
        serviceType: botType,
        subscriptionId: subscriptionData?.subscription_id,
        pricingPlanCode: pricingInfo?.planCode,
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
        subscriptionStatus: subscriptionData?.status === "trial" ?  "trial"  : "active" as "active",
        originalSubscriptionStatus: subscriptionData?.status === "trial" ?  "trial"  : "active" as "active",
      }, {
        organizationId: org.id,
        serviceType: botType === "chat" ? "voice" : "chat",
        pricingPlanCode: botType === "chat" ? "voice_free" : "chat_free",
        originalSubscriptionStatus: "trial",
        subscriptionStatus: "trial",
        startDate: subscriptionStartDate,
        endDate: subscriptionEndDate,
    }]

    // Subscription creation
      await Promise.all([
        createContactList({
          name: "leads contacts",
          organizationId: org.id,
          isDefault: true,
        }),
        createOrgZohoSubscription(subscription),
        createSubscriptionPlanUsage(subscription)
      ])
      if(!org) {
        return errorResponse(event, 500, "Failed to store client data. Please contact support.")
      }

    // User session creation
    const session = await lucia.createSession(
      userDetails.id,
      { email: userDetails.email },
      { sessionId: uuid() },
    );
    
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
    logger.info(`Client onboarding successful via hosted page: OrganizationId: ${org.id}`)
    sendEmail(
      config.envType !== "development" ? "rianozal@tringlabs.ai" : "tringdev@whitemastery.com", // to
      `Welcome aboard: ${org.name}`, // subject
      `<div>                             
        <p>Hi</p> 
        <p><strong>${userDetails.username}</strong> just started their journey with Tring AI.</p> 
        <p>Greetings are sent, and onboarding is in progress.</p>
          <div>
            <p><strong>User Details:</strong></p>
            <p>Name: ${userDetails?.username}</p>
            <p>Email: ${userDetails?.email}</p>
            <p>Mobile: ${userDetails?.countryCode} ${userDetails?.mobile}</p>
            <p>City: ${userDetails?.address.city}</p>
            <p>Country: ${userDetails?.address.country}</p>
          </div>
        <p>Best,<br>support@tringlabs.ai</p>
      </div>`,
    );
    
    sendEmail(
      userDetails.email, // to
      "Welcome To Tring AI !!", // subject
      `<div>
         <p>Hi <strong>${userDetails?.username}</strong>,</p>
         <p>Welcome to Tring AI🎉</p>
          <p>Wohoo!! We’re Excited to Have You Onboard 🎉</p>
          <p>We're thrilled to welcome you to Tring AI - your hub for creating captivating conversational voice and chat agents, designed to help you achieve your revenue goals. Here’s to smarter customer service!</p>
          <p>In just a few simple steps, you'll be on your way to making waves in the world of communication.</p>
         <p>Cheers,<br>Rian Ozal</p>
      </div>`,
    );
    return { org: org?.id }
  } catch (error: any) {
    logger.error(`Client onboaring via hostedPage id API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Onboarding via hostedpage id is failed")
  }
})