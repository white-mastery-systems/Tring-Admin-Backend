export const getTemplatesByWabaId = async (
  wabaId: string,
  accessToken: string,
  limit: string,
): Promise<any> => {
  const apiUrl = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status&limit=${limit}`;

  const templateList: { data: any } = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return templateList?.data;
};

export const deleteTemplateById = async (
  wabaId: string,
  accessToken: string,
  hsmId: string,
  templateName: string,
): Promise<any> => {
  const apiUrl = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?hsm_id=${hsmId}&name=${templateName}`;

  const deleteResponse = await $fetch(apiUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return deleteResponse;
};

export const editTemplate = async (
  wabaId: string,
  accessToken: string,
  category?: string,
  components?: any,
): Promise<any> => {
  const apiUrl = `https://graph.facebook.com/v21.0/${wabaId}/message_templates`;

  const editResponse = await $fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      category: category,
      components: components,
    },
  });

  return editResponse;
};

export const listAllApprovedTemplates = async (
  wabaId: string,
  accessToken: string,
): Promise<any> => {
  const apiUrl = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status&status=APPROVED`;

  const approvedTemplates: { data: any } = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return approvedTemplates?.data;
};

export const getTemplateDetailsByName = async (
  wabaId: string,
  accessToken: string,
  templateName: string,
) => {
  const apiUrl = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?name=${templateName}`;

  const templateDetails: { data: any } = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return templateDetails?.data;
};

export const createWhatsappMessageTemplate = async (
  wabaId: string,
  accessToken: string,
  templateName: string,
  languageCode: string,
  templateComponents: any,
) => {
  const apiUrl = `https://graph.facebook.com/v21.0/${wabaId}/message_templates`;
  const createResponse = await $fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      name: templateName,
      category: 'MARKETING',
      language: languageCode,
      components: templateComponents,
    },
  });

  return createResponse;
};

export const sendWhatsappTemplateMessage = async (
  phoneId: string,
  accessToken: string,
  userPhone: string,
  templateName: string,
  templateComponents: Record<string, any>,
  languageCode?: string,
) => {
  const data = await $fetch(
    `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    {
      method: "post",
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

  return data;
};
