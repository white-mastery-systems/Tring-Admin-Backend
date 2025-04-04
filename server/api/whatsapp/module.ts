import { getWhatsappBotByIntgrationId } from "../../utils/db/bot";
import { fetchUserByPhoneOrCreate } from "../../utils/db/bot-user";
import { createChat, createChatMessage, getChatMessagesById } from "../../utils/db/chats";

const db = useDrizzle();

export const getIntegrationByOrgId = async (organizationId: string, integrationId?: string | undefined) => {
  if (integrationId) {
    const integrationDetails = await db.query.integrationSchema.findFirst({
      where: and(
        eq(integrationSchema.id, integrationId),
        eq(integrationSchema.org_id, organizationId),
        eq(integrationSchema.crm, "whatsapp"),
        eq(integrationSchema.type, "whatsapp"),
      ),
    });
    return integrationDetails;
  }
  const integrationDetails = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.org_id, organizationId),
      eq(integrationSchema.crm, "whatsapp"),
      eq(integrationSchema.type, "whatsapp"),
    ),
  });
  return integrationDetails;
};

export const sendWhatsappCommand = async (integrationId:string, organizationId:string, metaToken: string, pid: string, userPhone: string, message: string) => {
  const { chat, } = await getWhatsappBotUserAndBot(integrationId, organizationId, userPhone);
  const [chatHistory, data] = await Promise.all([
    getWhatsappChatHistory(chat.id),
    createChatMessage({ chatId: chat.id, content: message, role: "user" }),
  ]);
};

export const getWhatsappChatHistory = async (chatId: string) => {
  const chatMessages = await getChatMessagesById(chatId);
  if (!chatMessages?.messages.length) return [];

  const messagesWithoutComments = chatMessages.messages.filter(
    (message) => message.role !== "comment",
  );

  const messages = messagesWithoutComments.map((message) => ({
    id: message.id,
    role: message.role as "user" | "assistant",
    content: message.content,
    metadata: message.metadata as Record<string, any> | undefined,
    createdAt: message.createdAt ?? new Date(),
  }))!;

  return messages;
};

export const getWhatsappBotUserAndBot = async (integrationId:string, organizationId:string, userPhone: string, username?: string) => {
  const [botDetails, botUser] = await Promise.all([
    getWhatsappBotByIntgrationId(integrationId),
    fetchUserByPhoneOrCreate(userPhone, organizationId, "whatsapp", username || "",),
  ]);

  const chat = await fetchWhatsappChatOrCreate(
    botUser.id,
    botDetails?.id || "",
    organizationId,
  );

  return { botDetails, botUser, chat };
};

export const fetchWhatsappChatOrCreate = async (userId: string, botId: string, orgId: string) => {
  const chat = await db.query.chatSchema.findFirst({
    where: and(
      eq(chatSchema.botUserId, userId),
      eq(chatSchema.botId, botId),
      eq(chatSchema.channel, "whatsapp"),
    ),
    orderBy: desc(chatSchema.createdAt),
  });

  if (chat) {
    return chat;
  }

  const newChat = await createChat({
    botUserId: userId,
    botId,
    organizationId: orgId,
    channel: "whatsapp",
  });

  return newChat;
};