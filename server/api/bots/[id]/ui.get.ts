import momentTz from "moment-timezone"
import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { getSubcriptionPlanDetailByPlanCode } from "~/server/utils/db/pricing";
import { getOrgPlanUsage } from "~/server/utils/v2/db/planUsage";

export default defineEventHandler(async (event) => {
  try {
    const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));
    let bot = await getBotDetailsNoCache(id);
    bot = await isValidReturnType(event, bot);

    const orgId = bot?.organizationId

    const orgDetail = await getOrganizationById(orgId)
    const adminDetails = await getAdminByOrgId(orgId)

    const adminCountry = adminDetails?.address?.country!

    const orgZohoSubscription = await getOrgZohoSubscription(bot?.organizationId, "chat")
    
    let planDetail

    // const planDetail = await getSubcriptionPlanDetailByPlanCode(orgZohoSubscription?.pricingPlanCode!, adminCountry)
    if(orgZohoSubscription?.subscriptionStatus === "trial" || orgZohoSubscription?.pricingPlanCode === "chat_free") {
      planDetail = await getPricingInformation("chat_free")
    } else {
      planDetail = await getSubcriptionPlanDetailByPlanCode(orgZohoSubscription?.pricingPlanCode!, adminCountry)
    }

    const subscriptionPlanUsage = await getOrgPlanUsage(orgId, "chat")

    const usedSessions = subscriptionPlanUsage?.interactionsUsed || 0
    const maxSessions = planDetail?.sessions || 0
    const wallet = orgDetail?.wallet || 0

    if(usedSessions >= maxSessions) {
      if(wallet > 0 && orgZohoSubscription?.pricingPlanCode !== "chat_free" && orgZohoSubscription?.subscriptionStatus !== "trial") {
        const extraSessionCost = 1 * planDetail?.extraSessionCost!
        console.log({ extraSessionCost, wallet })
        if(extraSessionCost > wallet) {
          return errorResponse(event, 403, "Wallet Balance Exhausted: Your wallet balance is exhausted. Please add more funds to your wallet to continue.")
        }
      }
    }

    const currentDate = new Date()
    const subscriptionEndDate = orgZohoSubscription?.endDate || momentTz().utc()

    if(currentDate > subscriptionEndDate) {
      await updateOrgZohoSubscription(orgId, "chat", { subscriptionStatus: "inactive" })
      // await updateChatbotStatus(orgId)
      return errorResponse(event, 403, "Subscription Expired: Your subscription plan has expired. Please renew your subscription to continue using the service.")
    }

    if(orgZohoSubscription?.subscriptionStatus === "inactive" || orgZohoSubscription?.subscriptionStatus === "cancelled") {
       return errorResponse(event, 403, "Subscription Inactive: Your subscription is not active. Please activate your subscription to access this service.")
    }
     
    return (bot.metadata as Record<string, any>).ui;
  } catch (error: any) {
    logger.error(`Chatbot - get UI API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event)
  }
});







// old code

// export default defineEventHandler(async (event) => {
//   const timeZoneHeader = event.node?.req?.headers["time-zone"];
//   const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
//   const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

//   let bot = await getBotDetailsNoCache(id);
//   bot = await isValidReturnType(event, bot);

//   // if (!bot) return sendError(event, createError({ statusCode: 404 }));
  
//   const orgSubscription = await db.query.orgSubscriptionSchema.findFirst({
//     where: and(
//       eq(orgSubscriptionSchema.organizationId, bot.organizationId),
//       eq(orgSubscriptionSchema.botType, "chat")
//     )
//   })

//   const planDetails = await db.query.adminPricingSchema.findFirst({
//     where: eq(adminPricingSchema.planCode, orgSubscription?.planCode),
//   });

//   if (!planDetails?.sessions) {
//     return sendError(event, createError({ statusCode: 404 }));
//   }

//   let startDate, endDate
//   if(orgSubscription?.subscriptionCreatedDate && orgSubscription?.expiryDate) {
//      startDate = momentTz(orgSubscription?.subscriptionCreatedDate).tz(timeZone).toDate()
//      endDate = momentTz(orgSubscription?.expiryDate).tz(timeZone).toDate()
//   } else {
//      startDate = momentTz().tz(timeZone).startOf("month").toDate()
//      endDate = momentTz().tz(timeZone).endOf("month").toDate()
//   }
  
//   // get interacted chats 
//   const interactedSessions = await getInteractedSessions(bot.organizationId, startDate, endDate)

//   const usedSessions = interactedSessions.length 
//   const maxSessions = planDetails.sessions
//   const orgWalletSessions = orgSubscription?.walletSessions

//   let availableSessions = Math.max(maxSessions - usedSessions, 0);

//   // Calculate expiry date and check if the subscription is expired
//   const currentDate = momentTz().tz(timeZone).toDate();
//   const expiryDate = momentTz(orgSubscription?.expiryDate)
//   .tz(timeZone)
//   .toDate();
//   if (orgSubscription?.status === "inactive") {
//     return sendError(
//       event,
//       createError({
//         statusCode: 403,
//         statusMessage:
//           "Subscription Inactive: Your subscription is not active. Please activate your subscription to access this service.",
//       }),
//     );
//   } else if (orgSubscription?.planCode === "chat_free") {
//     if (availableSessions < 0) {
//       return sendError(
//         event,
//         createError({
//           statusCode: 403,
//           statusMessage:
//             "Session Limit Exceeded: Your free plan has exceeded the session limit. Consider upgrading to a paid plan.",
//         }),
//       );
//     }
//   } else if (currentDate > expiryDate) {
//     return sendError(
//       event,
//       createError({
//         statusCode: 403,
//         statusMessage:
//           "Subscription Expired: Your subscription plan has expired. Please renew your subscription to continue using the service.",
//       }),
//     );
//   } else if (usedSessions > maxSessions) {
//     let extraSessions = Math.max(usedSessions - maxSessions, 0);
//     const currentWallet = Math.max(orgWalletSessions - extraSessions, 0);
//     if (currentWallet < 0) {
//       return sendError(
//         event,
//         createError({
//           statusCode: 403,
//           statusMessage:
//             "Wallet Balance Exhausted: Your wallet balance is exhausted. Please add more funds to your wallet to continue.",
//         }),
//       );
//     }
//   }
 
//   return (bot.metadata as Record<string, any>).ui;
// });
