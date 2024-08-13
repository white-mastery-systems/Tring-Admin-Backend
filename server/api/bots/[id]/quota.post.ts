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

  const usage = bot.organization.usedQuota + 1;
  const query = sql`UPDATE ADMIN.organization
SET
  used_quota = ${usage}
WHERE
  id = ${bot.organizationId};`;

  console.log(query);
  return await db.execute(query);
});
