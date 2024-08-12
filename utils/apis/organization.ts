export const listLeads = async (): Promise<
  (SelectLead & {
    bot: Pick<SelectChatBot, "name">;
    botUser: Pick<SelectBotUser, "name">;
  })[]
> => {
  return await $fetch("/api/org/leads");
};

export const getLeadTranscript = async (chatId: string) => {
  return await $fetch(`/api/org/chat/${chatId}`);
};
