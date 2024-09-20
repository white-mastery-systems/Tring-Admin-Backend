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
  const response = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log(response);
  return response;
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
  const response = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log(response);
  return response;
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
  const response = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log(response);
  return response;
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
  const response = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log(response);
  return response;
}
