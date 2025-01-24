import momentTz from "moment-timezone"

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  let bot = await getBotDetailsNoCache(id);
  bot = await isValidReturnType(event, bot);

  if (!bot) return sendError(event, createError({ statusCode: 404 }));
  
  const orgSubscription = await db.query.orgSubscriptionSchema.findFirst({
    where: and(
      eq(orgSubscriptionSchema.organizationId, bot.organizationId),
      eq(orgSubscriptionSchema.botType, "chat")
    )
  })

  const planDetails = await db.query.adminPricingSchema.findFirst({
    where: eq(adminPricingSchema.planCode, orgSubscription?.planCode),
  });

  if (!planDetails?.sessions) {
    return sendError(event, createError({ statusCode: 404 }));
  }

  let startDate, endDate
  if(orgSubscription?.subscriptionCreatedDate && orgSubscription?.expiryDate) {
     startDate = momentTz(orgSubscription?.subscriptionCreatedDate).tz(timeZone).toDate()
     endDate = momentTz(orgSubscription?.expiryDate).tz(timeZone).toDate()
  } else {
     startDate = momentTz().tz(timeZone).startOf("month").toDate()
     endDate = momentTz().tz(timeZone).endOf("month").toDate()
  }
  
  // get interacted chats 
  const interactedSessions = await db.query.chatSchema.findMany({
      where: and(
        gte(chatSchema.createdAt, startDate),
        lte(chatSchema.createdAt, endDate),
        eq(chatSchema.interacted, true),
        eq(chatSchema.organizationId, bot.organizationId),
      ),
  })

  const usedSessions = interactedSessions.length 
  const maxSessions = planDetails.sessions
  const orgWalletSessions = orgSubscription?.walletSessions

  let availableSessions = Math.max(maxSessions - usedSessions, 0);

  // Calculate expiry date and check if the subscription is expired
  const currentDate = momentTz().tz(timeZone).toDate();
  const expiryDate = momentTz(orgSubscription?.expiryDate)
  .tz(timeZone)
  .toDate();
  if (orgSubscription?.status === "inactive") {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage:
          "Subscription Inactive: Your subscription is not active. Please activate your subscription to access this service.",
      }),
    );
  } else if (orgSubscription?.planCode === "chat_free") {
    if (availableSessions < 0) {
      return sendError(
        event,
        createError({
          statusCode: 403,
          statusMessage:
            "Session Limit Exceeded: Your free plan has exceeded the session limit. Consider upgrading to a paid plan.",
        }),
      );
    }
  } else if (currentDate > expiryDate) {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage:
          "Subscription Expired: Your subscription plan has expired. Please renew your subscription to continue using the service.",
      }),
    );
  } else if (usedSessions > maxSessions) {
    let extraSessions = Math.max(usedSessions - maxSessions, 0);
    const currentWallet = Math.max(orgWalletSessions - extraSessions, 0);
    if (currentWallet < 0) {
      return sendError(
        event,
        createError({
          statusCode: 403,
          statusMessage:
            "Wallet Balance Exhausted: Your wallet balance is exhausted. Please add more funds to your wallet to continue.",
        }),
      );
    }
  }
 
  return (bot.metadata as Record<string, any>).ui;
});
