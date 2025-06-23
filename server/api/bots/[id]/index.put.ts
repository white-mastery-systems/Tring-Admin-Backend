import { chatIndustryDefaultNotes } from "~/server/utils/chat-default-notes";
import { chatDynamicFormValues } from "~/server/utils/chat-dynamic-forms";

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
  }
  
  if(body?.emailRecipients) {
    body.emailRecipients = [...new Set(body?.emailRecipients)]
  }
  
  let botDetails: any = await getBotDetails(botId);
  let metaData: any = botDetails?.metadata;

  
  let defaultIntents: string | undefined, defaultNotes: string | undefined;
  let defaultformStructure 
  
  if(!body?.formStructure) {
    defaultIntents = industryIntents[body.type as keyof typeof industryIntents]
    defaultNotes = chatIndustryDefaultNotes[body.type as keyof typeof chatIndustryDefaultNotes]?.note;
    defaultformStructure = chatDynamicFormValues[body.type as keyof typeof chatDynamicFormValues];
  }
  
  metaData = {
    ...metaData,
    ...body.metadata,
    prompt: {
      ...metaData.prompt,
      ...body?.metadata?.prompt,
      ...defaultIntents && defaultNotes && { 
        INTENTS: defaultIntents,
        NOTES: defaultNotes
      }
    },

  };
  const bot = await updateBotDetails(botId, {
    ...body,
    ...{ metadata: metaData },
    ...defaultformStructure && { formStructure: defaultformStructure }
  });

  if(defaultIntents) {
    const splitIntents = defaultIntents?.split("\n").filter((intent) => intent !== "other")
    const intentData: any = splitIntents?.map((intent) => ({
      intent,
      botId: bot.id,
      organizationId: bot.organizationId,
    }))
    await createBotIntent(intentData)
  }
 
  return isValidReturnType(event, bot);
});
