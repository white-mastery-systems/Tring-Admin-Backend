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

export const getAnalyticsData = async (period: any) => {
  return await $fetch(`/api/org/analytics`, {
    params: period,
  });
};
// export const filterAnalyticsData = async (value: any) => {
//   try {
//     const response = await useLazyFetch(`/api/org/analytics`, {
//       params: { period: value },
//     })
//     return response;
//   } catch (error) {
//     console.error("Error fetching analytics data:", error);
//   }
// };

export const updateIntegrationById = async ({
  id,
  integrationDetails,
  onSuccess,
}: {
  id: string;
  integrationDetails: any;
  onSuccess: Function;
}) => {
  try {
    const createIntegration = await $fetch<SelectChatBot>(
      `/api/org/integrations/${id}`,
      {
        method: "PUT",
        body: integrationDetails,
      },
    );
    onSuccess();

    return createIntegration;
  } catch (err: any) {
    toast.error(err.data.data[0].message);
  }
};

export const createIntegration = async ({
  integrationDetails,
  onSuccess,
}: {
  integrationDetails: any;
  onSuccess: Function;
}) => {
  try {
    const createIntegration = await $fetch<SelectChatBot>(
      `/api/org/integrations`,
      {
        method: "POST",
        body: integrationDetails,
      },
    );
    onSuccess();

    return createIntegration;
  } catch (err: any) {
    toast.error(err.data.data[0].message);
  }
};

export const verifyIntegration = async ({
  integrationDetails,
  onSuccess,
}: {
  integrationDetails: any;
  onSuccess: Function;
}) => {
  try {
    const createIntegration = await $fetch<SelectChatBot>(
      `/api/org/integrations`,
      {
        method: "PUT",
        body: integrationDetails,
      },
    );
    onSuccess();

    return createIntegration;
  } catch (err: any) {
    toast.error(err.data.data[0].message);
  }
};

export const deleteIntegration = async ({
  integrationId,
  onSuccess,
}: {
  integrationId: string;
  onSuccess: Function;
}) => {
  try {
    const deleteIntegration = await $fetch<SelectChatBot>(
      `/api/org/integrations/${integrationId}`,
      {
        method: "DELETE",
      },
    );
    console.log("hi");
    onSuccess();
    toast.success("Integration removed successfully");

    return deleteIntegration;
  } catch (err: any) {
    if (err.status === 500) {
      toast.error("Cannot delete: Integration has connected bots");
    }
    toast.error(err.data.data[0].message);
  }
};
