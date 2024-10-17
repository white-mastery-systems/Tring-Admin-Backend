export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body: any = await isValidBodyHandler(event, zodUpdateChatBot);

  if (body?.channels?.whatsapp) {
    const data = await db.execute(
      sql`UPDATE ${chatBotSchema}
SET channels = jsonb_set(channels, '{whatsapp}', '""'::jsonb)
WHERE channels->>'whatsapp' = ${body?.channels?.whatsapp};
`,
    );
    console.log({ data });
  }

  let botDetails: any = await getBotDetails(botId);
  let metaData: any = botDetails?.metadata;
  metaData = {
    ...metaData,
    ...body.metadata,
    prompt: {
      ...metaData.prompt,
      ...body?.metadata?.prompt,
    },
  };
  const bot = await updateBotDetails(botId, {
    ...body,
    ...{ metadata: metaData },
  });
  return isValidReturnType(event, bot);
});
