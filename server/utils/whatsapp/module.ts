import { logger } from "~/server/logger";

export interface CannedWhatsappMessage {
  response: string;
  options: { id: string; title: string; description: string }[];
}

export async function getSharedWhatsappDetails({
  code,
  id,
}: {
  code: string;
  id: string;
}) {
  const url =
    `https://graph.facebook.com/v21.0/${id}` +
    "?fields=id,name,currency,owner_business_info" +
    `&access_token=${code}`;
  const sharedWhatsappDetails = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  logger.info(`sharedWhatsappDetails ${JSON.stringify(sharedWhatsappDetails)}`);
  return sharedWhatsappDetails;
}

export async function fetchPhoneNumbers({
  code,
  id,
}: {
  code: string;
  id: string;
}) {
  const url =
    `https://graph.facebook.com/v21.0/${id}/phone_numbers` +
    "?fields=id,cc,country_dial_code,display_phone_number,verified_name,status,quality_rating,search_visibility,platform_type,code_verification_status" +
    `&access_token=${code}`;
  const phoneNumbers = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  logger.info(`phoneNumbers ${JSON.stringify(phoneNumbers)}`);
  return phoneNumbers;
}

export async function fetchMessageTemplates({
  code,
  id,
}: {
  code: string;
  id: string;
}) {
  const url =
    `https://graph.facebook.com/v21.0/${id}/message_templates` +
    "?fields=language,name,rejected_reason,status,category,sub_category,last_updated_time,components,quality_score" +
    "&limit=50" +
    `&access_token=${code}`;
  const messageTemplatesResponse = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  logger.info(
    `messageTemplatesResponse ${JSON.stringify(messageTemplatesResponse)}`,
  );
  return { messageTemplatesResponse };
}

export async function fetchSubscribedApps({
  code,
  id,
}: {
  code: string;
  id: string;
}) {
  const url =
    `https://graph.facebook.com/v21.0/${id}/subscribed_apps` +
    `?access_token=${code}`;
  const subscribedApps = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  logger.info(`subscribedApps ${JSON.stringify(subscribedApps)}`);
  return subscribedApps;
}

export async function subscribeApp({ code, wabaId }: { code: string; wabaId: string }) {
  try {
    const url = `https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`;
    const subscribeAppResponse = await $fetch(url, {
      method: "POST",
      body: JSON.stringify({
        access_token: code,
      }),
      headers: { "Content-Type": "application/json" },
    });
    logger.info(`subscribeAppResponse ${JSON.stringify(subscribeAppResponse)}`);

    return subscribeAppResponse;
  } catch (err: any) {
    logger.info(`logging failed ${err.message}`);
  }
}

export async function createWhatsAppMessage(
  payload: any,
  userPhone: string,
  notes: string,
) {
  notes = notes?.trim() || "Lead Details";
  notes = (notes.length > 60) ? notes.substring(0, 60) : notes;
  const url = "https://graph.facebook.com/v21.0/552375867948675/messages"; 
  const messageBody = {
    messaging_product: "whatsapp",
    to: userPhone,
    type: "template",
    template: {
      name: "utility_notification_1",
      language: { code: "en" },
      components: [
        {
          type: "header",
          parameters: [{ type: "text", text: notes }],
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: payload.intent },
            { type: "text", text: payload.name },
            { type: "text", text: payload.phone },
            { type: "text", text: payload.email },
            { type: "text", text: payload.botName },
            { type: "text", text: payload.conversationHistory },
            { type: "text", text: payload.whatsappLink },
          ],
        },
      ],
    },
  };

  try {
    const response = await $fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer EAAwYX9ZCRR1gBO2Ag3w9gLjmhvJn0iA0LIN6JZAIyFZC8PWBiMPHaqizoW4eHuXxG3CoOZBhqrLlyruTxpLJVW7KnzmwK1guAuIMZB0XZAB2rq0oPIDfWUljoVsrCz8y7kwjToSUAMPZAeOysIuZALweNaOnVxvASZCBgg3hE883kEwIy5sShIvQPVV6P6BErJf87WwZDZD`,
      },
      body: messageBody,
    });
    logger.info(`Whatsapp message sent ${JSON.stringify(response)}`);
    return response;
  } catch (error:any) {
    logger.info(`Error sending whatsapp message ${error?.message}`);
    return false
  }
}

export const sendWhatsappMessage = async (
  metaToken: string,
  phoneId: string,
  userPhone: string,
  message: string,
) => {
  const data = await $fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`,{
    ignoreResponseError: true,
    method: "post",
    headers: {
      Authorization: `Bearer ${metaToken}`,
    },
    body: {
      messaging_product: "whatsapp",
      to: userPhone,
      type: "text",
      text: {
        preview_url: true,
        body: message,
      },
    },
  });

  return data
};

export const sendWhatsappButtonMessage = async (
  metaToken: string,
  pid: string,
  to: string,
  message: CannedWhatsappMessage,
  // replyId?: string,
) => {
  const buttons = message.options.filter((option) => option.title.length <= 20).map((option, index) => ({
      type: "reply",
      reply: {
        id: option.id || `${index}`,
        title: option.title,
      },
    }));

  // if (buttons.length < 1 || buttons.length > 3) {
  //   return sendWhatsappMessage(metaToken, pid, to, message.response);
  // }

  try {
    const data = await $fetch(`https://graph.facebook.com/v20.0/${pid}/messages`, {
        ignoreResponseError: true,
        method: "post",
        headers: {
          Authorization: `Bearer ${metaToken}`,
        },
        // context: replyId ? { message_id: replyId } : undefined,
        body: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "interactive",
          interactive: {
            type: "button",
            body: { text: message.response },
            action: { buttons },
          },
        },
      },
    );
    return data;
  } catch (error:any) {
    logger.error(`Error sending whatsapp button message ${error?.message}`);
    return null
  }
};

export const getTemplateHeaderVariables = (example: any): any[] => {
  if (!example) return [];
  if (Array.isArray(example?.header_text_named_params) && example?.header_text_named_params?.length) {
    return example?.header_text_named_params.map((item: any) => item?.param_name).filter(Boolean);
  }
  else if (Array.isArray(example.header_text)) {
    return Array.isArray(example.header_text[0]) ? example.header_text[0] : example.header_text;
  }
  return [];
};

export const getTemplateBodyVariables = (example: any): any[] => {
  if (!example) return [];
  if (Array.isArray(example?.body_text_named_params) && example?.body_text_named_params?.length) {
    return example?.body_text_named_params.map((item: any) => item?.param_name).filter(Boolean);
  } else if (Array.isArray(example.body_text)) {
    return Array.isArray(example.body_text[0]) ? example.body_text[0] : example.body_text;
  }
  return [];
};

export const variablePrameterObj = (variableName: any, contact: any) => {
  const varName = `${variableName}`.toLowerCase()
  if (["Name", "fullname", "full name", "user name", "username", "name"].includes(varName)) {
    return { type: "text", text: `${(contact?.name) ?? variableName}` }
  } else if (varName === "email") {
    return { type: "text", text: contact?.email || variableName }
  } else if (["mobile", "phone", "phone no", "mobile no"].includes(varName) && contact?.phoneNumber) {
    return { type: "text", text: `${contact?.countryCode || "+91"}${contact?.phoneNumber || variableName}` }
  } else if (["Countrycode", "CountryCode", "countryCode", "Country Code", "country code", "country_code", "country-code", "Country_Code", "Country-Code"].includes(varName) && contact?.countryCode) {
    return { type: "text", text: `${contact?.countryCode || "+91"}` }
  } else { 
    return {type:"text", text:variableName}
  }
};