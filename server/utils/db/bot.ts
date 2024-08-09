import { SelectChatBot } from "~/server/schema/bot";

const db = useDrizzle();
const cache = useStorage("redis");

const getCacheBotKey = (botId: string) => `chatbot:${botId}`;

export const createBot = async (bot: InsertChatBot) =>
  (await db.insert(chatBotSchema).values(bot).returning())[0];

export const listBots = async (organizationId: string) =>
  await db.query.chatBotSchema.findMany({
    where: eq(chatBotSchema.organizationId, organizationId),
    orderBy: [desc(chatBotSchema.createdAt)],
    columns: {
      id: true,
      name: true,
      createdAt: true,
      documentId: true,
    },
  });

export const getBotDetailsNoCache = async (botId: string) => {
  const bot = await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
    with: {
      documents: true,
    },
  });
  return bot;
};

export const getBotDetails = async (botId: string) => {
  const cachedBot = await cache.getItem<
    SelectChatBot & { documents: SelectDocument[] }
  >(getCacheBotKey(botId));
  if (cachedBot) return cachedBot;

  const bot = await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
    with: {
      documents: true,
    },
  });
  if (!bot) return undefined;

  await cache.setItem(getCacheBotKey(botId), bot);
  return bot;
};

export const updateBotDetails = async (
  botId: string,
  bot: ZodInfer<typeof zodUpdateChatBot>,
) => {
  cache.removeItem(getCacheBotKey(botId));
  return (
    await db
      .update(chatBotSchema)
      .set(bot)
      .where(eq(chatBotSchema.id, botId))
      .returning()
  )[0];
};

export const deleteBot = async (botId: string) => {
  cache.removeItem(getCacheBotKey(botId));
  return (
    await db
      .delete(chatBotSchema)
      .where(eq(chatBotSchema.id, botId))
      .returning()
  )[0];
};
