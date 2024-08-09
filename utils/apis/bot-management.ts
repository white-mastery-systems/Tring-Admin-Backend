import type { InternalApi } from "nitropack";
import type { SelectChatBot, SelectDocument } from "~/server/schema/bot";

export const listApiBots = async () => {
  const botsList = await $fetch("/api/bots");

  const formatDateStringToDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDate(date, "dd.MM.yyyy ");
  };

  return botsList.map((bot) => {
    return {
      id: bot.id,
      name: bot.name,
      status: bot.documentId ? true : false,
      createdAt: formatDateStringToDate(bot.createdAt),
    };
  });
};

export const getBotDetails = async (botId: string) => {
  const bot = await $fetch<SelectChatBot & { documents: SelectDocument[] }>(
    `/api/bots/${botId}`,
  );
  return bot;
};

export const updateBotDetails = async (botDetails: SelectChatBot) => {
  const updatedBot = await $fetch<SelectChatBot>(`/api/bots/${botDetails.id}`, {
    method: "PUT",
    body: botDetails,
  });
  return updatedBot;
};
