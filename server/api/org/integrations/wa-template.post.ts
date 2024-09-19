const zodListIntegration = z.object({
  integrationId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const body = await isValidBodyHandler(event, zodListIntegration);
  const db = useDrizzle();
  const integration = await db.query.integrationSchema.findFirst({
    where: and(
      eq(integrationSchema.id, body.integrationId),
      eq(integrationSchema.org_id, organizationId),
    ),
  });
  //   https://graph.facebook.com/v20.0/455294850990360/message_templates
  // const query = getQuery(event);
  const url =
    `https://graph.facebook.com/v20.0/${integration?.metadata.wabaId}/message_templates` +
    "?fields=language,name,rejected_reason,status,category,sub_category,last_updated_time,components,quality_score" +
    "&limit=50" +
    `&access_token=${integration?.metadata.access_token}`;

  const templateResponse = await $fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const phoneNumberUrl =
    `https://graph.facebook.com/v20.0/${integration?.metadata.wabaId}/phone_numbers` +
    "?fields=id,cc,country_dial_code,display_phone_number,verified_name,status,quality_rating,search_visibility,platform_type,code_verification_status" +
    `&access_token=${integration?.metadata.access_token}`;
  const phoneNumberRespone = await $fetch(phoneNumberUrl, {
    method: "GET",
  });

  return { templateResponse, phoneNumberRespone };
});
