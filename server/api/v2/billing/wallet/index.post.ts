import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { addonPlanList } from "~/server/utils/v2/billing/addonList"
import { createAddon } from "~/server/utils/v2/billing/wallet"
import { getOrgSubscriptionId } from "~/server/utils/v2/db/zohoSubscription"
import { zodBotTypeQuery } from "~/server/utils/validations"

const zodCreateAddon = z.object({
  plan: z.string(),
  redirectUrl: z.string()
})

export default defineEventHandler(async (event) => {
  try {
    const orgId = await isOrganizationAdminHandler(event)
    const body = await isValidBodyHandler(event, zodCreateAddon)
    // const query = await isValidQueryHandler(event, zodBotTypeQuery)

    const orgZohoSubscription = await getOrgSubscriptionId(orgId)
    const adminConfig = await getAdminConfig()

    const addonPrice = addonPlanList?.find(({ plan }) => plan === body.plan)?.price
    
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
      exchange_rate: 2,
      payment_gateways: [
        {
          payment_gateway: "razorpay",
        },
      ],
    }

    const addonresponse = await createAddon(addonPayload, adminConfig?.metaData)
    return addonresponse
  } catch (error: any) {
    logger.error(`Zoho-billing addon creation API Error: ${JSON.stringify(error.message)}`)
     return errorResponse(event, 500, "Unable to add the addon")
  }
})