export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event);
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body: any = await isValidBodyHandler(event, zodUpdateChatBot);
  if (body?.channels?.whatsapp) {
    // const url =
    //   "https://graph.facebook.com/v20.0/455294850990360/subscribed_apps";
    // const response = await $fetch(url, {
    //   method: "POST",
    //   body: {
    //     access_token:
    //       "EAAwYX9ZCRR1gBO6X9JuMMJHbrKqowgaXD0EPbQv5qLZCUvgAZBlxtMAqjAMIB62i32rZBaY8dz7pTpkttZBQep8RlzcLlwZCBDI6UtEXcRtj6inZA54wuiYFNs3QHEpg5Mv6P7kUx1SNVcx5ntVZBFXqXKUSvZBpt0IEek2GrhqRixtTOMNrojczAZCZBORFbIZCWHduUHOUJEBfvbjzP2iEDuhYAJsf2u3jSKmE8ar73ltqrnk9XweuvKGS7lzrxXWsoWAzK4RYCt9BzgZDZD",
    //   },
    //   headers: { "Content-Type": "application/json" },
    // });
    //
    // const data = await response.json();
    //
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
