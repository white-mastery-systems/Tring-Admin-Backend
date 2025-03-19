import momentTz from "moment-timezone";
import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { getAdminConfig } from "~/server/utils/db/adminConfig";
import { getUserByUserId } from "~/server/utils/db/user";
import { createSubscription } from "~/server/utils/v2/billing/subscription";
import { getOrgZohoSubscription } from "~/server/utils/v2/db/zohoSubscription";
import { BotType, zodBotTypeQuery } from "~/server/utils/validations";

const zodCreateSubscriptionBody = z.object({
  plan: z.string(),
  locationData: z.record(z.any()),
  redirectUrl: z.string()
})

export default defineEventHandler(async (event) => {
  console.log("inside")
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader)
      ? timeZoneHeader[0]
      : timeZoneHeader || "Asia/Kolkata";

    const body = await isValidBodyHandler(event, zodCreateSubscriptionBody);
    const query = await isValidQueryHandler(event, zodBotTypeQuery);
    
    const getOrgCurrentPlan = await getOrgZohoSubscription(organizationId, query.type)
    
    // if(getOrgCurrentPlan?.pricingPlanCode !== "chat_free" && getOrgCurrentPlan?.subscriptionStatus !== "cancelled") {
    //   const expiryDate = momentTz(getOrgCurrentPlan?.endDate)
    //     .tz(timeZone)
    //     .toDate();
    //   const currentDate = momentTz().tz(timeZone).toDate();
    //   if (currentDate < expiryDate) {
    //     return errorResponse(event, 400, "Plan change not allowed. You can only subscribe to a new plan after the current plan expires.")
    //   }
    // }
    const adminZohoConfig = await getAdminConfig()
    const userDetails = await getUserByUserId(event?.context?.user?.id!)
    const orgDetails = await getOrganizationById(organizationId)

    const data = await createSubscription({
      organizationId,
      userDetails,
      body,
      metaData: adminZohoConfig?.metaData,
      orgDetails
    })
   
    return data
  } catch (error: any) {
    logger.error(`Zoho-billing - create subscription API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to subscribe the plan")
  }
});