const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

  let bot = await getBotDetailsNoCache(id);
  bot = await isValidReturnType(event, bot);

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
    data.map((item: any) => {
      extraAddonsPrice += item.amount;
    });
    const extrChatsAvailable =
      Number(extraAddonsPrice) / Number(planDetails?.extraSessionCost);
    availableQuota += extrChatsAvailable;
  }
  if (availableQuota <= 0) {
    return sendError(event, createError({ statusCode: 403 }));
  }
  // bot.organization.planCode === "chat_free" &&
  //  else if (availableQuota <= 0) {
  //   return sendError(
  //     event,
  //     createError({ statusCode: 403, statusMessage: "Trial Expired" }),
  //   );
  // }
  // return Math.floor(availableQuota);
  // const availableQuota = bot.organization.maxQuota - bot.organization.usedQuota;
  // if (bot.organization.planCode === "chat_free" && availableQuota <= 0)
  //   return sendError(
  //     event,
  //     createError({ statusCode: 403, statusMessage: "Trial Expired" }),
  //   );

  return (bot.metadata as Record<string, any>).ui;
});
