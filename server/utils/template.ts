export const getTemplatesByWabaId = async (
  wabaId: string,
  accessToken: string,
  limit: string,
): Promise<any> => {
  const apiUrl = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status&limit=${limit}`;

  const templateList = await $fetch(apiUrl, {
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

  const approvedTemplates = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return approvedTemplates.data;
};

export const getTemplateDetailsByName = async (
  wabaId: string,
  accessToken: string,
  templateName: string) => {
  const apiUrl = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?name=${templateName}`;

  const templateDetails = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return templateDetails.data;  
};