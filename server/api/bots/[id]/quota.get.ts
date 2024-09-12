export default defineEventHandler(async (event) => {
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const db = useDrizzle();
  const bot = await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
    with: {
      organization: true,
    },
  });

  if (!bot) return sendError(event, createError({ statusCode: 404 }));
  const planDetails = await db.query.adminPricingSchema.findFirst({
    where: eq(adminPricingSchema.planCode, bot.organization.planCode),
  });

  if (!planDetails?.sessions) {
    return sendError(event, createError({ statusCode: 404 }));
  }
  let availableQuota = planDetails?.sessions - bot.organization.usedQuota;
  if (availableQuota <= 0) {
    const data = await db.query.paymentSchema.findMany({
      where: and(
        eq(paymentSchema.type, "addon"),
        eq(paymentSchema.organizationId, bot.organizationId),
      ),
    });
    let extraAddonsPrice = 0;
    data.map((item) => {
      extraAddonsPrice += item.amount;
    });
    const extrChatsAvailable =
      Number(extraAddonsPrice) / Number(planDetails?.extraSessionCost);
    availableQuota += extrChatsAvailable;
  }
  if (bot.organization.planCode === "chat_free" && availableQuota <= 0) {
    return sendError(event, createError({ statusCode: 403 }));
  }
  return Math.floor(availableQuota);
});
