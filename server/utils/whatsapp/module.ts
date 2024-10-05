import { logger } from "~/server/logger";

export async function getSharedWhatsappDetails({
  code,
  id,
}: {
  code: string;
  id: string;
}) {
  const url =
    `https://graph.facebook.com/v20.0/${id}` +
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
    `https://graph.facebook.com/v20.0/${id}/phone_numbers` +
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
    `https://graph.facebook.com/v20.0/${id}/message_templates` +
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
    `https://graph.facebook.com/v20.0/${id}/subscribed_apps` +
    `?access_token=${code}`;
  const subscribedApps = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  logger.info(`subscribedApps ${JSON.stringify(subscribedApps)}`);
  return subscribedApps;
}
export async function subscribeApp({ code, id }: { code: string; id: string }) {
  try {
    console.log({ code, id });
    const url = `https://graph.facebook.com/v20.0/${id}/subscribed_apps`;
    const subscribeAppResponse = await $fetch(url, {
      method: "POST",
      body: JSON.stringify({
        access_token: code,
      }),
      headers: { "Content-Type": "application/json" },
    });
    logger.info(`subscribeAppResponse ${JSON.stringify(subscribeAppResponse)}`);
    console.log("subscribed");
    return subscribeAppResponse;
  } catch (err: any) {
    logger.info(`logging failed ${err.message}`);
  }
}
