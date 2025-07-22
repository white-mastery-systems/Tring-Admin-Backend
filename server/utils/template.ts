import { logger } from "../logger";

export const getNewTemplatesByWabaId = async (
  wabaId: string,
  accessToken: string,
  status: string,
): Promise<any> => {
  let statusFilter = "all"

  if(status !== "all") {
    statusFilter = status === "approved" ? "APPROVED" : "REJECTED"
  }

  const getTemplatesApiEndpoint = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`;
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

    return templateListApiEndpoint
  } catch (error:any) {
    logger.error(`Error occurred while fetching templates: ${JSON.stringify(error?.response?._data)}`)
    throw new Error(error?.response?._data?.error?.error_user_msg || error?.response?._data?.error?.error_user_title || "Failed to fetch templates");
  }
};

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
  } catch (error:any) {
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
  } catch (error:any) {
    logger.error(`Error occurred while deleting template: ${JSON.stringify(error?.response?._data)}`)
    throw new Error(error?.response?._data?.error?.error_user_msg || error?.response?._data?.error.error_user_title || "Failed to delete template");
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
  } catch (error:any) {
    logger.error(`Error occurred while editing template: ${JSON.stringify(error?.response?._data)}`)
    throw new Error(error?.response?._data?.error?.error_user_msg || error?.response?._data?.error?.error_user_title || "Failed to edit template");
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
  } catch (error:any) {
    logger.error(`Error occurred while fetching approved templates: ${JSON.stringify(error?.response?._data)}`)
    throw new Error(error?.response?._data?.error?.error_user_msg || error?.response?._data?.error?.error_user_title || "Failed to fetch approved templates");
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
  } catch (error:any) {
    logger.error(`Error occurred while fetching template details: ${JSON.stringify(error?.response?._data)}`)
    throw new Error(error?.response?._data?.error?.error_user_msg || error?.response?._data?.error?.error_user_title || "Failed to fetch template details");
  }
};

export const createWhatsappMessageTemplate = async (
  wabaId: string,
  accessToken: string,
  templateName: string,
  languageCode: string,
  templateComponents: any,
  category?:string
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
          category: category || "MARKETING",
          components: templateComponents,
        },
      },
    );
    logger.info("Template created successfully");
    return templateCreationApiResponse;
  } catch (error:any) {
    logger.error(`Error occurred while creating template: ${JSON.stringify(error?.response?._data)}`);
    throw new Error(error?.response?._data?.error?.error_user_msg || error?.response?._data?.error?.error_user_title || error?.response?._data?.error?.message || "Failed to create template");
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
  const sendMessageTemplateApiEndpoint = `https://graph.facebook.com/v23.0/${phoneId}/messages`;

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
    logger.error(`Error occurred while sending WhatsApp template: ${JSON.stringify(error?.response?._data)}`)
    throw new Error(error?.response?._data?.error?.error_user_msg || error?.response?._data?.error?.error_user_title || "Failed to send WhatsApp template message");
  }
};

export const deStructureVariables = (inputData: any, variableType?:string) =>{
  variableType = (variableType) ?? "NAMED";
  const obj: {
    bodyVariables: any[],
    headerVariables: any[],
    buttonVariables: any[],
    filteredVarList: any[],
    headerText: string | null,
    bodyText: string | null,
    footerText: string | null,
    buttonText: string | null,
  } = {
    bodyVariables: [],
    headerVariables: [],
    buttonVariables: [],
    filteredVarList: [],
    headerText: inputData?.headerText?.trim() || null,
    bodyText: inputData?.bodyText?.trim() || null,
    footerText: inputData?.footerText?.trim() || null,
    buttonText: inputData?.buttonText?.trim() || null,
  };

  const variables: any[] = (inputData?.variables) ?? (inputData?.templateVariables || []);
 if (variableType === "POSITIONAL" && variables.length) {
    let uniqueHeader = false; let buttonCount = 0;
    const filteredVarList = variables.filter((item: any) => {
      if (item.placed === "header") {
        if (!uniqueHeader) {
          uniqueHeader = true;
          return true;
        }
        return false;
      }
      if (item.placed === "button") {
        if (buttonCount <= 3) { return true; }
        buttonCount++;
        return false;
      }
      return true;
    });
  
    const headerVariables = positioningVariables(filteredVarList.filter((item: any) => item.placed === "header"), extractPositions(obj.headerText));
    const bodyVariables = positioningVariables(filteredVarList.filter((item: any) => item.placed === "body"), extractPositions(obj.bodyText));
    const buttonVariables = positioningVariables(filteredVarList.filter((item: any) => item.placed === "button"), extractPositions(obj.buttonText));
    obj.headerText = positioningText(obj.headerText, headerVariables.length);
    obj.bodyText = positioningText(obj.bodyText, bodyVariables.length);
  
  return {...obj, headerVariables, bodyVariables, buttonVariables, filteredVarList}
  } else {
    if(obj.headerText){
      const { text:headerText, variables:headerVariables } = replaceNamedVariables(obj.headerText, "header");
      obj.headerText = headerText;
      // @ts-ignore
      obj.headerVariables = headerVariables;
    }
    if(obj.bodyText){
      const { text:bodyText, variables:bodyVariables } = replaceNamedVariables(obj.bodyText, "body");
      obj.bodyText = bodyText;
      // @ts-ignore
      obj.bodyVariables = bodyVariables;
    }
    const buttonVariables = positioningVariables(variables.filter((item: any) => item.placed === "button"), extractPositions(obj.buttonText));
    obj.buttonVariables = buttonVariables;

    return {...obj}
  }
}

export const positioningText = (text: string | null, maxLength: number)=>{
  if (!text) {return text};
  // Extract all unique placeholders in order
  const matches = [...new Set(text.match(/\{\{(\d+)\}\}/g))]; // Unique placeholders
  const positionMap: Record<string, string> = {};

  // Assign new sequential numbers
  matches.slice(0, maxLength).forEach((match, index) => {
    positionMap[match] = `{{${index + 1}}}`;
  });

  // Replace placeholders with new sequential ones
  return text.replace(/\{\{\d+\}\}/g, match => positionMap[match] || "");
}

export const extractPositions = (text: string | null) => {
  return text ? [...text.matchAll(/\{\{(\d+)\}\}/g)].map((match) => match[1]) : [];
};

export const positioningVariables = (variables:any[], positionOrder:any[]) =>{
  variables.sort((a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position))
  return repositionVariables(variables)
}

export const repositionVariables = (variables:any[]) =>{
  return variables.map((item, index) => ({ ...item, position: (index + 1).toString(), example: (item.example) ?? item.name }));
}

export const positioningNamedVariables = (variables: any[]) => {
  if (variables.length) {
    const list = variables.map((item:any) => {
      const name = item?.name ?? item?.example ?? item?.text ?? null;
      if(name) return { param_name: name, example: name };
    })
    return list.filter(Boolean)
  }
  return [];
};

export const replaceNamedVariables = (text:string, placed: string) => {
  const matches = [...text.matchAll(/\{\{([^}]+)\}\}/g)];
  
  if (!matches.length) return { text, variables: [] };
  
  const seen = new Set();
  const examples: any[] = [];
  let resultText = text;

  if (["header","button"].includes(placed)) {
    const firstMatch = matches[0];
    const fullMatch = firstMatch[0]; // e.g. "{{company}}"
    const varName = firstMatch[1]; // e.g. "company"

    resultText = resultText.replace(fullMatch, "{{1}}"); // Replace only first
    examples.push({ example: varName });

    // Remove remaining variables
    for (let i = 1; i < matches.length; i++) {
      const toRemove = matches[i][0];
      resultText = resultText.replace(toRemove, "");
    }
    // Enforce 60 character limit for header
    if (placed === "header" && resultText.length > 60) resultText = resultText.slice(0, 60);
  } else {
    matches.forEach((match, index) => {
      const fullMatch = match[0]; // e.g. "{{name}}"
      const varName = match[1];   // e.g. "name"
      
      // If this variable hasn't been processed yet
      if (!seen.has(fullMatch)) {
        seen.add(fullMatch);
        examples.push({ example: varName });
        // Use a RegExp to replace all occurrences of this exact variable
        resultText = resultText.replace(new RegExp(`\\{\\{${varName}\\}\\}`, "g"), `{{${examples.length}}}`);
      }
    });
  }

  return { text: resultText, variables:examples };
};