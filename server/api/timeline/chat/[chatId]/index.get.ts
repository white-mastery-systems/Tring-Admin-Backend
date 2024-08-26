const getChatValidation = z.object({
  chatId: z.string().uuid("chat Id is required"),
});

export default defineEventHandler(async (event) => {
  const body = await getValidatedRouterParams(
    event,
    getChatValidation.safeParse,
  );
  if (!body.data) return;
  return await listTimelinesByChatId(body.data?.chatId, {});
});
