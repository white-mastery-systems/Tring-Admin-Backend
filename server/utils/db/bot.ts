// import { isNotNull, ne } from "drizzle-orm";

import { isNotNull, isNull, like } from "drizzle-orm";
import { InsertBotIntegration, InsertIntent } from "~/server/schema/bot";

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

export const createBotIntent = async (intent: InsertIntent) => {
  return (await db.insert(botIntentSchema).values(intent).returning())[0];
};

export const listBotIntents = async (
  // organizationId: string,
  botId: string,
  // query: queryInterface,
) => {
  let filters: any = [eq(botIntentSchema.botId, botId)];

  const data = await db.query.botIntentSchema.findMany({
    where: and(...filters),
    orderBy: [desc(chatBotSchema.createdAt)],
    columns: {
      organizationId: false,
    },
  });
  return data;
};

export const createBotIntegration = async (
  integration: InsertBotIntegration,
) => {
  return (
    await db.insert(botIntegrationSchema).values(integration).returning()
  )[0];
};
export const listBotIntegrations = async (botId: string) => {
  let filters: any = [eq(botIntegrationSchema.botId, botId)];

  const data = await db.query.botIntegrationSchema.findMany({
    where: and(...filters),
    orderBy: [desc(botIntegrationSchema.createdAt)],
    columns: {
      organizationId: false,
    },
  });
  return data;
};

export const getIntent = async (intentId: string) =>
  await db.query.botIntentSchema.findFirst({
    where: eq(botIntentSchema.id, intentId),
  });

export const deleteBotIntent = async (botId: string, intentId: string) => {
  const intent = await db.query.botIntentSchema.findFirst({
    where: eq(botIntentSchema.id, intentId),
  });
  const bot = await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
  });

  if (!(intent && bot)) return null;

  let metadata = bot.metadata as Record<string, any>;
  let prevIntents = metadata?.prompt?.INTENTS as string;
  let currentIntents = prevIntents.replace(`\n-${intent.intent}`, "");

  metadata.prompt.INTENTS = currentIntents;

  await updateBotDetails(botId, {
    metadata,
  });
  const deletedIntent = await db
    .delete(botIntentSchema)
    .where(eq(botIntentSchema.id, intentId));

  return deletedIntent;
};
