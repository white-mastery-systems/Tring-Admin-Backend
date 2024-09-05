import { createBotIntent } from "~/server/utils/db/bot";
export const zodInsertChatBotIntent = z.object({
  intent: z.string().min(2, "Intent too short"),
  link: z.string().url().min(5, "Link too short"),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  const body = await isValidBodyHandler(event, zodInsertChatBotIntent);
  const bot = await createBotIntent({
    ...body,
    botId: botId,
    organizationId,
  });
  let botDetails: any = await getBotDetails(botId);
  console.log(
    botDetails?.metadata.prompt.INTENTS,
    "botDetails?.metadata.prompt.INTENTS",
  );
  let metaData: any = botDetails?.metadata;
  metaData = {
    ...metaData,
    prompt: {
      ...metaData.prompt,
      INTENTS: `${botDetails?.metadata.prompt.INTENTS}\n-${body.intent}`,
    },
    [body.intent]: body.link,
  };

  await updateBotDetails(botId, {
    metadata: metaData,
  });
  return bot;
});
