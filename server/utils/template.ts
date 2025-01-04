import { logger } from "../logger";

export const getTemplatesByWabaId = async (
  wabaId: string,
  accessToken: string,
  limit: string,
): Promise<any> => {
  const getTemplatesApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status&limit=${limit}`;

  try {
    const templateListApiEndpoint: { data: any } = await $fetch(
      getTemplatesApiEndpoint,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    logger.info("Templates fetched successfully");

    return templateListApiEndpoint?.data;
  } catch (error) {
    logger.error({
      message: "Error occurred while fetching templates",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to fetch templates");
  }
};

export const deleteTemplateById = async (
  wabaId: string,
  accessToken: string,
  hsmId: string,
  templateName: string,
): Promise<any> => {
  const deleteTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?hsm_id=${hsmId}&name=${templateName}`;

  try {
    const templateDeleteApiResponse = await $fetch(deleteTemplateApiEndpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    logger.info("Template deleted successfully");
    return templateDeleteApiResponse;
  } catch (error) {
    logger.error({
      message: "Error occurred while deleting template",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to delete template");
  }
};

export const editTemplateById = async (
  accessToken: string,
  templateId: string,
  templateComponents?: any,
): Promise<any> => {
  const editTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${templateId}`;

  try {
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
    logger.info("Template edited successfully");
    return templateEditApiResponse;
  } catch (error) {
    logger.error({
      message: "Error occurred while editing template",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to edit template");
  }
};

export const listAllApprovedTemplates = async (
  wabaId: string,
  accessToken: string,
): Promise<any> => {
  const listApprovedTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status&status=APPROVED`;

  try {
    const approvedTemplatesApiResponse: { data: any } = await $fetch(
      listApprovedTemplateApiEndpoint,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    logger.info("Approved templates fetched successfully");
    return approvedTemplatesApiResponse?.data;
  } catch (error) {
    logger.error({
      message: "Error occurred while fetching approved templates",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to fetch approved templates");
  }
};

export const getTemplateDetailsByName = async (
  wabaId: string,
  accessToken: string,
  templateName: string,
): Promise<any> => {
  const getTemplateDetailsApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?name=${templateName}`;

  try {
    const templateDetailsApiResponse: { data: any } = await $fetch(
      getTemplateDetailsApiEndpoint,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    logger.info("Template details fetched successfully");
    return templateDetailsApiResponse?.data;
  } catch (error) {
    logger.error({
      message: "Error occurred while fetching template details",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to fetch template details");
  }
};

export const createWhatsappMessageTemplate = async (
  wabaId: string,
  accessToken: string,
  templateName: string,
  languageCode: string,
  templateComponents: any,
): Promise<any> => {
  const createTemplateApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates`;

  try {
    const templateCreationApiResponse = await $fetch(
      createTemplateApiEndpoint,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          name: templateName,
          language: languageCode,
          category: "MARKETING",
          components: templateComponents,
        },
      },
    );
    logger.info("Template created successfully");
    return templateCreationApiResponse;
  } catch (error) {
    logger.error({
      message: "Error occurred while creating template",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to create template");
  }
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

  try {
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
    logger.info("WhatsApp template message sent successfully");
    return sendMessageTemplateApiResponse;
  } catch (error) {
    logger.error({
      message: "Error occurred while sending WhatsApp template message",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to send WhatsApp template message");
  }
};
