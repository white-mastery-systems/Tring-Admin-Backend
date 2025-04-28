import { chatIndustryDefaultNotes } from "~/server/utils/chat-default-notes";
import { chatDynamicFormValues } from "~/server/utils/chat-dynamic-forms";
import { getIndustryDetail } from "~/server/utils/db/industries";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
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
  
  if(body?.emailRecipients) {
    body.emailRecipients = [...new Set(body?.emailRecipients)]
  }
  
  let botDetails: any = await getBotDetails(botId);
  let metaData: any = botDetails?.metadata;
  
  const industryDetail = await getIndustryDetail({ industryId: body?.industryId });

  const industryName = industryDetail?.industryName;
  
  let defaultIntents: string | undefined, defaultNotes: string | undefined;
  let defaultformStructure
  
  if(!body?.customForms) {
    defaultformStructure = chatDynamicFormValues[industryName as keyof typeof chatDynamicFormValues];
    const defaultFormIntentName = Object.keys(defaultformStructure)[0]
    defaultIntents = `other\nsite_visit\nschedule_call\nschedule_appointment\n${defaultFormIntentName}`
    defaultNotes = chatIndustryDefaultNotes[industryName as keyof typeof chatIndustryDefaultNotes]?.note;
  }
  
  metaData = { 
    ...metaData,
    ...body.metadata,
    prompt: {
      ...metaData.prompt,
      ...body?.metadata?.prompt,
      ...defaultIntents && { 
        INTENTS: defaultIntents
      },
      ...defaultNotes && {
        NOTES: defaultNotes
      }
    },
  };
  const bot = await updateBotDetails(botId, {
    ...body,
    ...{ metadata: metaData },
    ...defaultformStructure && { customForms: defaultformStructure }
  });

  if(defaultIntents) {
    const splitIntents = defaultIntents?.split("\n").filter((intent) => intent !== "other")
    const intentData: any = splitIntents?.map((intent) => ({
      type: intent === "form" ? "custom" : "schedule_form" ,
      intent,
      metadata: intent === "form" ? {
        defaultformStructure
      } :
      {
        "traditionalForm": true,
        "naturalConversation": false
      },
      botId: bot.id,
      organizationId: bot.organizationId,
    }))
    await createBotIntent(intentData)
  }
 
  return isValidReturnType(event, bot);
});
