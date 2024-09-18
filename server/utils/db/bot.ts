// import { isNotNull, ne } from "drizzle-orm";

import { count, isNotNull, isNull, like } from "drizzle-orm";
import { InsertBotIntegration } from "~/server/schema/chatbot/botIntegration.table";
import { InsertIntent } from "~/server/schema/chatbot/intents.table";
import momentTz from "moment-timezone";

const db = useDrizzle();

const getCacheBotKey = (botId: string) => `chatbot:${botId}`;

export const createBot = async (bot: InsertChatBot) =>
  (await db.insert(chatBotSchema).values(bot).returning())[0];

interface queryInterface {
  page?: string;
  limit?: string;
  active?: string;
  q?: string;
}
export const listBots = async (
  organizationId: string,
  query: queryInterface,
  timeZone: string,
) => {
  let filters: any = [eq(chatBotSchema.organizationId, organizationId)];
  if (query?.active === "true") {
    filters.push(isNotNull(chatBotSchema.documentId));
  } else if (query?.active === "false") {
    filters.push(isNull(chatBotSchema.documentId));
  }
  if (query?.q) {
    filters.push(ilike(chatBotSchema.name, `%${query.q}%`));
  }

  let page, offset, limit = 0
    
  if(query.page && query.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }

  let data = await db.query.chatBotSchema.findMany({
    where: and(...filters),
    orderBy: [desc(chatBotSchema.createdAt)],
    columns: {
      id: true,
      name: true,
      createdAt: true,
      documentId: true,
    },
  });
  data = data.map((i: any) => ({
    ...i,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A")
  }))

  if(query?.page && query?.limit) {
     const paginatedChatBots = data.slice(offset, offset + limit); 
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length/ limit) || 1,
      totalCount: data.length,
      data: paginatedChatBots
    }
  } else {
      return data
  }
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
  return (
    await db
      .update(chatBotSchema)
      .set({
        ...bot,
        updatedAt: new Date()
      })
      .where(eq(chatBotSchema.id, botId))
      .returning()
  )[0];
};

export const deleteBot = async (botId: string) => {
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

export const updateBotIntent = async (botId: string, intentId: string, intent: InsertIntent) => {
  return (
    await db.update(botIntentSchema)
    .set({
      ...intent,
      updatedAt: new Date()
    })
    .where(
      and(
        eq(botIntentSchema.botId, botId),
        eq(botIntentSchema.id, intentId)
      ))
    .returning()
  )[0]
}

export const createBotIntegration = async (
  integration: InsertBotIntegration,
) => {
  return (
    await db.insert(botIntegrationSchema).values(integration).returning()
  )[0];
};
export const listBotIntegrations = async (botId: string, query: any) => {
  let filters: any = [eq(botIntegrationSchema.botId, botId)];

  let page, offset, limit = 0
    
  if(query.page && query.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }

  const data = await db.query.botIntegrationSchema.findMany({
    where: and(...filters),
    orderBy: [desc(botIntegrationSchema.createdAt)],
    with: {
      integration: true,
    },
  });

  if(query?.page && query?.limit) {
     const paginatedChatBotIntegrations = data.slice(offset, offset + limit); 
     return {
        page: page,
        limit: limit,
        totalPageCount: Math.ceil(data.length/ limit) || 1,
        totalCount: data.length,
        data: paginatedChatBotIntegrations
     }
  } else {
      return data
  }
};

export const getBotIntegrationById = async (botId: string, botIntegrationId: string) => {
  return await db.query.botIntegrationSchema.findFirst({
    where: and(
      eq(botIntegrationSchema.botId, botId),
      eq(botIntegrationSchema.id, botIntegrationId)
    )
  })
}

export const updateBotIntegration = async(botId: string, botIntegrationId: string, botIntegration: zodInsertBotIntegration) =>{
  return (
     await db.update(botIntegrationSchema)
    .set({
      ...botIntegration,
      updatedAt: new Date()
    })
    .where(
      and(
      eq(botIntegrationSchema.botId, botId),
      eq(botIntegrationSchema.id, botIntegrationId)
    ))
    .returning()
    )[0]
}

export const deleteBotIntegration = async (
  botId: string,
  integrationId: string,
) => {
  let filters: any = [
    eq(botIntegrationSchema.botId, botId),
    eq(botIntegrationSchema.id, integrationId),
  ];

  const data = await db.delete(botIntegrationSchema).where(and(...filters));
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
