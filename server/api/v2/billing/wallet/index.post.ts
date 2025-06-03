import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createAddon } from "~/server/utils/v2/billing/wallet"
import { getOrgSubscriptionId } from "~/server/utils/v2/db/zohoSubscription"
import { inrCreditPriceList, usdCreditPriceList } from "~/server/utils/v2/billing/addonList";

const zodCreateAddon = z.object({
  plan: z.string(),
  redirectUrl: z.string()
})

export default defineEventHandler(async (event) => {
  try {
    const orgId = await isOrganizationAdminHandler(event)
    const body = await isValidBodyHandler(event, zodCreateAddon)

    const query = await isValidQueryHandler(event, z.object({
      countryCode: z.string().default("IN"),
    }))

    const orgZohoSubscription = await getOrgSubscriptionId(orgId)
    const adminConfig = await getAdminConfig()

    const credits = query.countryCode === "IN" ? inrCreditPriceList : usdCreditPriceList
    const addonPrice = credits?.find(({ plan }) => plan === body.plan)?.price
    
    const addonPayload = {
      subscription_id: orgZohoSubscription?.subscriptionId,
      addons: [
        {
          addon_code: body.plan,
          quantity: 1,
          price: addonPrice,
          tax_id: null,
        },
      ],
      redirect_url: body?.redirectUrl,
      payment_gateways: [
        {
          payment_gateway: query.countryCode === "IN" ? "razorpay" : "stripe",
        },
      ],
    }

    const addonresponse = await createAddon(addonPayload, adminConfig?.metaData)
  
    if(!addonresponse?.hostedpage) {
      return errorResponse(event, 500, "Unable to add the addon")
    }

    return {
      status: true,
      ...addonresponse
    }
  } catch (error: any) {
    logger.error(`Zoho-billing addon creation API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to add the addon")
  }
})