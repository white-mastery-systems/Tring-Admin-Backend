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
  const url = "https://graph.facebook.com/v21.0/552375867948675/messages";
  const messageBody = {
    messaging_product: "whatsapp",
    to: userPhone,
    type: "text",
    text: {
      preview_url: true,
      body: `*${notes ? notes : "Lead Generated"}* :tada:\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nBot Name: ${payload.botName}\nChat Link: ${payload.chatLink}\nWhatsapp Link: ${payload.whatsappLink}`,
    },
  };

  try {
    const response = await $fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer EAAwYX9ZCRR1gBO8JXwTbRQuayRxoYhXxMWIoPOKA59WQTy8KAQbOOjSZBCF6ZA9YUH2MRxr7Pm9b7hc0I6y86WyZCn32Nq0vnBlYkxhmeMD6n2CBuJo79pzjZA3NvSiBMkbDh3FF02nZAmb0jNvutje4F2u0VeazaZAphc0bBCZBcLXSFsUHmArXhyiQL5qcrwX0DQZDZD`,
      },
      body: messageBody,
    });
    logger.info(`Whatsapp message sent ${JSON.stringify(response)}`);
    return response;
  } catch (error) {
    logger.info(`Error sending whatsapp message ${error?.message}`);
  }
}
