import type { SelectChatBot, SelectDocument } from "~/server/schema/bot";

export const formatDateStringToDate = (dateString: any) => {
  const date = new Date(dateString);
  return formatDate(date, "dd.MM.yyyy ");
};
export const listApiBots = async () => {
  // await authHandlers.login({ username: "test", password: "asdf1234" });
  const botsList = await $fetch("/api/bots");

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
  toast.success("Bot updated successfully");
  await navigateTo({
    name: "BotManagementDetails-id",
    params: { id: botDetails.id },
  });
  return updatedBot;
};

export const disableBot = async (botId: string) => {
  await $fetch(`/api/bots/${botId}/disable`, {
    method: "DELETE",
  });
  toast.success("Bot disabled");
  return navigateTo({ name: "BotManagement" });
};

export const deleteBot = async (botId: string) => {
  await $fetch(`/api/bots/${botId}`, {
    method: "DELETE",
  });
  toast.success("Bot deleted successfully");
  return navigateTo({ name: "BotManagement" });
};
