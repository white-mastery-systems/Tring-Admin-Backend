export const getTemplatesByWabaId = async (
  wabaId: string,
  accessToken: string,
  limit: string,
): Promise<any> => {
  const getTemplatesApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status&limit=${limit}`;

  const templateListApiEndpoint: { data: any } = await $fetch(
    getTemplatesApiEndpoint,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return templateListApiEndpoint?.data;
};

export const deleteTemplateById = async (
  wabaId: string,
  accessToken: string,
  hsmId: string,
  templateName: string,
): Promise<any> => {
  const deleteTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?hsm_id=${hsmId}&name=${templateName}`;

  const templateDeleteApiResponse = await $fetch(deleteTemplateApiEndpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return templateDeleteApiResponse;
};

export const editTemplateById = async (
  accessToken: string,
  templateId: string,
  templateComponents?: any,
): Promise<any> => {
  const editTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${templateId}`;

  const templateEditApiResponse = await $fetch(editTemplateApiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      category: "MARKETING",
      components: templateComponents,
    },
  });

  return templateEditApiResponse;
};

export const listAllApprovedTemplates = async (
  wabaId: string,
  accessToken: string,
): Promise<any> => {
  const listApprovedTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status&status=APPROVED`;

  const approvedTemplatesApiResponse: { data: any } = await $fetch(
    listApprovedTemplateApiEndpoint,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return approvedTemplatesApiResponse?.data;
};

export const getTemplateDetailsByName = async (
  wabaId: string,
  accessToken: string,
  templateName: string,
): Promise<any> => {
  const getTemplateDetailsApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?name=${templateName}`;

  const templateDetailsApiResponse: { data: any } = await $fetch(
    getTemplateDetailsApiEndpoint,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return templateDetailsApiResponse;
};

export const createWhatsappMessageTemplate = async (
  wabaId: string,
  accessToken: string,
  templateName: string,
  languageCode: string,
  templateComponents: any,
): Promise<any> => {
  const createTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates`;
  const templateCreationApiResponse = await $fetch(createTemplateApiEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      name: templateName,
      category: "MARKETING",
      language: languageCode,
      components: templateComponents,
    },
  });

  return templateCreationApiResponse;
};

export const sendWhatsappTemplateMessage = async (
  phoneId: string,
  accessToken: string,
  userPhone: string,
  templateName: string,
  templateComponents: Record<string, any>,
  languageCode?: string,
) => {
  const sendMessageTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
  const sendMessageTemplateApiResponse = await $fetch(
    sendMessageTemplateApiEndpoint,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        messaging_product: "whatsapp",
        to: userPhone,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: languageCode ?? "en",
          },
          components: templateComponents,
        },
      },
    },
  );

  return sendMessageTemplateApiResponse;
};
