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

export const createIntegration = async ({
  integrationDetails,
  onSuccess,
}: {
  integrationDetails: any;
  onSuccess: Function;
}) => {
  const createIntegration = await $fetch<SelectChatBot>(
    `/api/org/integrations`,
    {
      method: "POST",
      body: integrationDetails,
    },
  );
  onSuccess()
  // await navigateTo({
  //   name: "bots-id",
  //   params: { id: botDetails.id },
  // });
  return createIntegration;
};

export const deleteIntegration = async ({
  integrationId,
  onSuccess,
}: {
  integrationId: string;
  onSuccess: Function;
}) => {
  try {
    const createIntegration = await $fetch<SelectChatBot>(
      `/api/org/integrations/${integrationId}`,
      {
        method: "DELETE",
      },
    );
    onSuccess();
    toast.success("Integration removed successfully");
    // await navigateTo({
    //   name: "bots-id",
    //   params: { id: botDetails.id },
    // });
    return createIntegration;
  } catch (err) {
    toast.error(err.data.data[0].message);
  }
};
