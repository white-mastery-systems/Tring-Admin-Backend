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
  } catch (error: any) {
    logger.error({
      message: "Error occurred while sending WhatsApp template message",
      error: JSON.stringify(error),
      errorData: error?.data,
    });
    throw new Error("Failed to send WhatsApp template message");
  }
};

export const deStructureVariables = (inputData: any) => {
  const Obj = {
    bodyVariables: [],
    headerVariables: [],
    buttonVariables: [],
    headerText: inputData?.headerText || null,
    bodyText: inputData?.bodyText || null,
    footerText: inputData?.footerText || null,
  };

  const variableList = (inputData?.templateVariables?.length)? [...inputData?.templateVariables]: [];
  if (variableList.length) {
    const categorized = variableList.reduce((acc: any, item: any) => {
      const key = `${item.placed}Variables`; // Ensure correct key
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});

    // Reassign sequential positions
    Object.keys(categorized).forEach((key) => {
      categorized[key] = categorized[key].map((item: any, index: number) => ({
        ...item,
        position: (index + 1).toString(),
      }));
    });

    const positionMap: any = {};
    Object.values(categorized).flat().forEach((item: any, index) => {
      console.log({item, index});
      
      positionMap[item.position] = (index + 1).toString();
    });

    // Function to dynamically replace positions in text
    const updateTextPositions = (text: string | null) => {
      return (typeof text === "string") ? text.replace(/\{\{(\d+)\}\}/g, (_: any, pos: any, index:number) => {
        console.log({ _, pos, index });
        
        return `{{${positionMap[pos] || pos}}}`}): text;
    }

    Obj.headerText = updateTextPositions(Obj.headerText);
    Obj.bodyText = updateTextPositions(Obj.bodyText);
    Obj.footerText = updateTextPositions(Obj.footerText);

    return { ...Obj, ...categorized, positionMap };
  }
  return Obj;
};

export const deStructureVariables2 = (inputData: any) =>{
  const obj = {
    bodyVariables: [],
    headerVariables: [],
    buttonVariables: [],
    headerText: inputData?.headerText || null,
    bodyText: inputData?.bodyText || null,
    footerText: inputData?.footerText || null,
  };
  const variableList = (inputData?.templateVariables?.length)? [...inputData?.templateVariables]: [];
  if(variableList.length){
    const headerVariables = variableList.filter((item: any) => item.placed === "header");
    const bodyVariables = variableList.filter((item: any) => item.placed === "body");
    const buttonVariables = variableList.filter((item: any) => item.placed === "button");
    return {...obj, headerVariables, bodyVariables, buttonVariables}
  }
  return obj
}

const data ={
    "bodyVariables": [
        {
            "position": "1",
            "placed": "body",
            "example": "name"
        },
        {
            "position": "2",
            "placed": "body",
            "example": "email"
        },
        {
            "position": "3",
            "placed": "body",
            "example": "phone"
        },
        {
            "position": "4",
            "placed": "body",
            "example": "last name"
        }
    ],
    "headerVariables": [
        {
            "position": "1",
            "placed": "header",
            "example": "fullName"
        },
        {
            "position": "2",
            "placed": "header",
            "example": "firstName"
        }
    ],
    "buttonVariables": [
        {
            "position": "1",
            "placed": "button",
            "example": "phone"
        }
    ],
    "headerText": "Hi *{{1}}* - {{2}}",
    "bodyText": "Here are the details of the generated lead \nName: {{2}} \n Email: {{2}} \nPhone: {{4}} \nBot Name: {{3}} \nUseful Links: Chat:  https://example.com/chat/123  \nWhatsApp: https://wa.me/123456789",
    "footerText": "Tabs.ai",
}

// export const updateTextPositions = (text: string | null, categorized)