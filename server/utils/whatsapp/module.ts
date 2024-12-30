import { logger } from "~/server/logger";

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
  const url = "https://graph.facebook.com/v20.0/552375867948675/messages";
  // const messageBody = {
  //   messaging_product: "whatsapp",
  //   to: userPhone,
  //   type: "template",
  //   text: {
  //     preview_url: true,
  //     body: `*${notes ?? "Lead Details"}* \nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nBot Name: ${payload.botName}\nChat Link: ${payload.chatLink}\nWhatsapp Link: ${payload.whatsappLink}`,
  //   },
  // };
  
  const messageBody = {
    messaging_product: "whatsapp",
    to: userPhone,
    type: "template",
    template: {
      name: "lead_generated_notification",
      language: { code: "en" },
      components: [
        {
          type: "header",
          parameters: [{ type: "text", text: notes ?? "Lead Details" }],
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: payload.name },
            { type: "text", text: payload.email },
            { type: "text", text: payload.phone },
            { type: "text", text: payload.botName },
            { type: "text", text: payload.chatLink },
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
  } catch (error) {
    logger.info(`Error sending whatsapp message ${error?.message}`);
  }
}
