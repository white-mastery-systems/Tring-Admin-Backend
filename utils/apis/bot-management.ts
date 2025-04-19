import type { User } from "lucia";

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

export const updateBotDetails = async (botDetails: SelectChatBot,toastStatus: any) => {
  const updatedBot = await $fetch<SelectChatBot>(`/api/bots/${botDetails.id}`, {
    method: "PUT",
    body: botDetails,
  });
  if (toastStatus) {
    toast.success("Bot details updated successfully!");
  }
  // await navigateTo({
  //   name: "chat-bot-id",
  //   params: { id: botDetails.id },
  // });
  return updatedBot;
};

export const disableBot = async (botId: string) => {
  await $fetch(`/api/bots/${botId}/disable`, {
    method: "DELETE",
  });
  toast.success("Bot disabled");
  // return navigateTo({ name: "bot-management-chat-bot" });
};

export const deleteBot = async (botId: string, hardDelete: boolean = false) => {
  try {
    await $fetch(`/api/bots/${botId}`, {
      method: "DELETE",
      query: { hardDelete },
    });
    if (!hardDelete) {
      toast.success("Bot deleted successfully");
    }
    return navigateTo({ name: "chat-bot" });
  } catch (error) {
    toast.error("Cannot delete: bot has generated leads");
  }
};

export const addBotIntegration = async ({
  payload,
  onSuccess,
}: {
  payload: any;
  onSuccess: Function;
}) => {
  try {
    const createdBot = await $fetch<SelectChatBot>(
      `/api/bots/${payload.botId}/integrations`,
      {
        method: "POST",
        body: payload,
      },
    );
    onSuccess();
    return createdBot;
  } catch (err: any) {
    toast.error(err.data.statusMessage);
  }
};
export const updateBotIntegrationById = async ({
  payload,
  onSuccess,
}: {
  payload: any;
  onSuccess: Function;
}) => {
  try {
    const createdBot = await $fetch<SelectChatBot>(
      `/api/bots/${payload.botId}/integrations/${payload.botIntegrationId}`,
      {
        method: "PUT",
        body: payload,
      },
    );
    onSuccess();
    return createdBot;
  } catch (err: any) {
    console.log(err.data, "err.data -- err.data")
    toast.error(err.statusMessage);
  }
};

export const getBotIntegrations = async (botId: string) => {
  const botIntegrations = await $fetch<SelectBotIntegration>(
    `/api/bots/${botId}/integrations`,
  );
  return botIntegrations;
};

export const deleteBotIntegration = async ({
  botIntegrationId,
  botId,
  onSuccess,
}: any) => {
  try {
    const botIntegrations = await $fetch<SelectBotIntegration>(
      `/api/bots/${botId}/integrations/${botIntegrationId}`,
      {
        method: "DELETE",
      },
    );
    onSuccess();
    return botIntegrations;
  } catch (err: any) {
    toast.error(err.statusMessage);
  }
};


export const dynamicaFormDetails = async (botDetails: any, formDetails:any) => {
  const updatedBot = await $fetch<SelectChatBot>(`/api/bots/${botDetails}`, {
    method: "PUT",
    body: formDetails,
  });
  toast.success("Form added successfully");
  await navigateTo({
    name: "chat-bot-id",
    params: { id: botDetails.id },
  });
  return updatedBot;
};

export const emailTemplateEditor = async (botDetailsWithEmailTemplateEditValue: SelectChatBot) => {
  const updatedBot = await $fetch<SelectChatBot>(`/api/bots/${botDetailsWithEmailTemplateEditValue.id}`, {
    method: "PUT",
    body: botDetailsWithEmailTemplateEditValue,
  });
  toast.success("Uploaded successfully");
  // await navigateTo({
  //   name: "bot-management-chat-bot-id",
  //   params: { id: botDetails.id },
  // });
  return updatedBot;
};

// Voice bot
export const getVoiceBotDetails = async (botId: string) => {
  const bot = await $fetch<SelectChatBot & { documents: SelectDocument[] }>(
    `/api/voicebots/` + botId,
  );
  return bot;
};

export const getVoiceBotList = async () => {
  const bot = await $fetch<any>(
    `/api/voicebots?active=${true}`,
  );
  return bot;
};

export const deleteVoiceBot = async (botId: string) => {
  try {
    await $fetch(`/api/voicebots/${botId}`, {
      method: "DELETE",
    });
    toast.success("Voice Bot deleted successfully");
    return navigateTo({ name: "voice-bot" });
  } catch (error) {
    toast.error("Cannot delete: voice bot has generated leads");
  }
};

export const updateLLMConfig = async (payload: any, botId: string, message: string) => {
  try {
    const updateLLM = await $fetch(`/api/voicebots/${botId}`, {
      method: "PUT",
      body: payload,
    });

    toast.success(message);

    // if (message === "The voice bot has been integraded successfully.") {
    //   await navigateTo({
    //     name: "voice-bot-id",
    //     params: { id: botId },
    //   });
    // }
    return updateLLM;
  } catch (error) {
    toast.error(error?.statusMessage);
  }
};

export const updateVoiceBotIntegrationById = async ({
  payload,
  onSuccess,
}: {
  payload: any;
  onSuccess: Function;
}) => {
  try {
    const createdBot = await $fetch<SelectChatBot>(
      `/api/voicebots/${payload.botId}/integrations/${payload.botIntegrationId}`,
      {
        method: "PUT",
        body: payload,
      },
    );
    onSuccess();
    return createdBot;
  } catch (err: any) {
    toast.error(err?.data?.data[0]?.message);
  }
};

export const addVoiceBotIntegration = async ({
  payload,
  onSuccess,
}: {
  payload: any;
  onSuccess: Function;
}) => {
  try {
    const createdBot = await $fetch<SelectChatBot>(
      `/api/voicebots/${payload.botId}/integrations`,
      {
        method: "POST",
        body: payload,
      },
    );
    onSuccess();
    return createdBot;
  } catch (err: any) {
    toast.error(err.statusMessage);
  }
};
export const deleteVoiceBotIntegration = async ({
  botIntegrationId,
  botId,
  onSuccess,
}: any) => {
  try {
    const botIntegrations = await $fetch<SelectBotIntegration>(
      `/api/voicebots/${botId}/integrations/${botIntegrationId}`,
      {
        method: "DELETE",
      },
    );
    onSuccess();
    return botIntegrations;
  } catch (err: any) {
    toast.error(err.statusMessage);
  }
};


export const updateEmailConfig = async (emailConfigDetails: object) => {
  const updatedBot = await $fetch<SelectChatBot>(`/api/bots/${emailConfigDetails.botId}/intents/${emailConfigDetails.id}`, {
    method: "PUT",
    body: {
      emailRecipients: emailConfigDetails?.emailRecipients ?? [],
      isEmailEnabled: emailConfigDetails.isEmailEnabled
    },
  });
  toast.success("Email Configuration updated successfully");
  // await navigateTo({
  //   name: "bot-management-chat-bot-id",
  //   params: { id: emailConfigDetails.botId },
  // });
  return updatedBot;
};

export const getLocationDetail = async () => {
  const userLocationDetails = await $fetch(
    `https://ipv4-check-perf.radar.cloudflare.com/api/info`,
  );
  return userLocationDetails;
};
export const getUserDetail = async () => {
  const userDetails = await $fetch<User>("/api/user");
  return userDetails;
};
export const getIntegratedProviderNumberList = async (
  providerId: string
): Promise<null> => {
  try {
    return await $fetch(`/api/org/integrations/number-integration/${providerId}/incomingPhoneNumbers`);
  } catch (error) {
    toast.error(error?.statusMessage);
    return []; // Or handle it differently
  }
};
export const getPreRecordedAudioDetails = async (botId: string, organizationId: string,config: any) => {
  try {
    const bot = await $fetch<any>(`${config.public.voiceBotBaseUrl}/prerecordedAudio/metaData`, {
      method: 'GET',
      params: {
        bot_id: botId,
        organization_id: organizationId,
      },
    });
    return bot;
  } catch (error) {
    toast.error('Error fetching pre-recorded audio details');
  }
};
