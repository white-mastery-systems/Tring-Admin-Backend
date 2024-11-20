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
    name: "bot-management-chat-bot-id",
    params: { id: botDetails.id },
  });
  return updatedBot;
};

export const disableBot = async (botId: string) => {
  await $fetch(`/api/bots/${botId}/disable`, {
    method: "DELETE",
  });
  toast.success("Bot disabled");
  return navigateTo({ name: "bot-management-chat-bot" });
};

export const deleteBot = async (botId: string) => {
  try {
    await $fetch(`/api/bots/${botId}`, {
      method: "DELETE",
    });
    toast.success("Bot deleted successfully");
    return navigateTo({ name: "bot-management-chat-bot" });
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
    toast.error(err.data.data[0].message);
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
  } catch (err) {}
};


export const dynamicaFormDetails = async (botDetails: any, formDetails:any) => {
  const updatedBot = await $fetch<SelectChatBot>(`/api/bots/${botDetails}`, {
    method: "PUT",
    body: formDetails,
  });
  toast.success("Form added successfully");
  await navigateTo({
    name: "bot-management-chat-bot-id",
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

export const deleteVoiceBot = async (botId: string) => {
  try {
    await $fetch(`/api/voicebots/${botId}`, {
      method: "DELETE",
    });
    toast.success("Voice Bot deleted successfully");
    return navigateTo({ name: "bot-management-voice-bot" });
  } catch (error) {
    toast.error("Cannot delete: voice bot has generated leads");
  }
};

export const updateLLMConfig = async (payload: any, botId: string, message: string) => {
  const updateLLM = await $fetch(`/api/voicebots/${botId}`, {
    method: "PUT",
    body: payload,
  });
  toast.success(message);
  await navigateTo({
    name: "bot-management-voice-bot-id",
    params: { id: botId },
  });
  return updateLLM;
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
    toast.error(err.data.data[0].message);
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
    toast.error(err.data.data[0].message);
  }
};
