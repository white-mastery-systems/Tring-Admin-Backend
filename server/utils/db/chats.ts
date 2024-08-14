const db = useDrizzle();

export const getChatDetails = async (chatId: string) => {
  return await db.query.chatSchema.findFirst({
    where: eq(chatSchema.id, chatId),
    with: {
      botUser: true,
      bot: true,
      messages: {
        orderBy: asc(messageSchema.createdAt),
      },
    },
    orderBy: desc(chatSchema.createdAt),
  });
};
