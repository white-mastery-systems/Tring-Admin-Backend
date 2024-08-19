export const listLeads = async (): Promise<
  (SelectLead & {
    bot: Pick<SelectChatBot, "name">;
    botUser: Pick<SelectBotUser, "name">;
  })[]
> => {
  return await $fetch("/api/org/leads");
};

export const getLeadTranscript = async (chatId: any) => {
  return await $fetch(`/api/org/chat/${chatId}`);
};

export const getAnalyticsData = async () => {
  return await $fetch(`/api/org/analytics`);
};

export const createIntegration = async (integrationDetails: SelectChatBot) => {
  const createIntegration = await $fetch<SelectChatBot>(
    `/api/org/integrations`,
    {
      method: "POST",
      body: integrationDetails,
    },
  );
  toast.success("Integration added successfully");
  // await navigateTo({
  //   name: "bots-id",
  //   params: { id: botDetails.id },
  // });
  return createIntegration;
};
