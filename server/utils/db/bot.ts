// import { isNotNull, ne } from "drizzle-orm";

import { isNotNull, isNull, like } from "drizzle-orm";
import { InsertIntent } from "~/server/schema/bot";

const db = useDrizzle();
const cache = useStorage("redis");

const getCacheBotKey = (botId: string) => `chatbot:${botId}`;

export const createBot = async (bot: InsertChatBot) =>
  (await db.insert(chatBotSchema).values(bot).returning())[0];

interface queryInterface {
  active?: string;
  q?: string;
}
export const listBots = async (
  organizationId: string,
  query: queryInterface,
) => {
  let filters: any = [eq(chatBotSchema.organizationId, organizationId)];
  if (query?.active === "true") {
    filters.push(isNotNull(chatBotSchema.documentId));
  } else if (query?.active === "false") {
    filters.push(isNull(chatBotSchema.documentId));
  }
  if (query?.q) {
    filters.push(like(chatBotSchema.name, `%${query.q}%`));
  }

  const data = await db.query.chatBotSchema.findMany({
    where: and(...filters),
    orderBy: [desc(chatBotSchema.createdAt)],
    columns: {
      id: true,
      name: true,
      createdAt: true,
      documentId: true,
    },
  });
  return data;
};

export const getBotDetailsNoCache = async (botId: string) => {
  const bot = await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
    with: {
      documents: true,
      organization: true,
    },
  });
  return bot;
};

export const getBotDetails = async (botId: string) => {
  const bot = await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
    with: {
      documents: true,
    },
  });
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

export const createBotIntent = async (intent: InsertIntent) =>
  (await db.insert(botIntentSchema).values(intent).returning())[0];
