import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getOrgSubscriptionId } from "~/server/utils/v2/db/zohoSubscription"
import { inrCreditPriceList, usdCreditPriceList } from "~/server/utils/v2/billing/addonList";
import { createPaymentLinkInRazorpay } from "~/server/utils/v2/billing/wallet";

const zodCreateAddon = z.object({
  plan: z.string(),
  redirectUrl: z.string()
})

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
     
    const body = await isValidBodyHandler(event, zodCreateAddon)

    const query = await isValidQueryHandler(event, z.object({
      countryCode: z.string().default("IN"),
    }))

    const credits = query.countryCode === "IN" ? inrCreditPriceList : usdCreditPriceList
    const creditsDetail: any = credits?.find(({ plan }) => plan === body.plan)

    const razorpayPrice = creditsDetail.razorpayPrice
    const displayPrice = creditsDetail.price

    const currency = query.countryCode === "IN" ? "INR" : "USD"
    
    const orgZohoSubscription = await getOrgSubscriptionId(organizationId)

    if(!orgZohoSubscription) {
      return errorResponse(event, 400, "Subscription is not active")
    }

    const adminDetail = await getAdminByOrgId(organizationId)
    const payload = {
      amount: razorpayPrice,
      currency,
      description: `Adding ${displayPrice} ${currency === "INR" ? "Rupees" : "Dollars" } as credits to Tring AI wallet`,
      customer: {
        name: adminDetail?.username,
        contact: `${adminDetail?.countryCode}${adminDetail?.mobile}`,
        email: adminDetail?.email
      },
      notify: {
        sms: true,
        email: true
      },
      callback_url: body?.redirectUrl,
      callback_method: "get"
    }

    const data = await createPaymentLinkInRazorpay(payload)
    if(!data) {
      return errorResponse(event, 500, "Failed to add credits")
    }

    return {
      status: true,
      ...data
    }

  } catch (error: any) {
    logger.error(`Add credits API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Failed to add credits")
  }
})