const db = useDrizzle()

const getChatValidation = z.object({
  chatId: z.string().uuid("chat Id is required"),
});

export default defineEventHandler(async (event) => {
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const body = await getValidatedRouterParams(
    event,
    getChatValidation.safeParse,
  );
  if (!body.data) return;

  const botUser: any = await db.query.chatSchema.findFirst({
    where: eq(chatSchema.id, body.data?.chatId)
  })

  return await listTimelinesByChatId(body.data?.chatId, {}, botUser?.botUserId, timeZone);
});
