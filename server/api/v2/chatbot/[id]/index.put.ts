import { errorResponse } from "~/server/response/error.response";
import { chatIndustryDefaultNotes } from "~/server/utils/chat-default-notes";
import { chatDynamicFormValues } from "~/server/utils/chat-dynamic-forms";
import { getBotDetailsByName } from "~/server/utils/db/bot";
import { getIndustryDetail } from "~/server/utils/db/industries";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const { id: botId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body: any = await isValidBodyHandler(event, zodUpdateChatBot);

  const alreadyExistingBot = await getBotDetailsByName(organizationId, body?.name, "update", botId);
  if(alreadyExistingBot) {
    return errorResponse(event, 400, "Chatbot name already exists.")
  }
  
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
  
  const industryDetail = await getIndustryDetail({ industryId: body?.industryId });

  const industryName = industryDetail?.industryName;
  
  let defaultIntents: string | undefined, defaultNotes: string | undefined;
  let defaultformStructure : any
  
  if(body?.industryId && body?.industryId !== botDetails?.industryId) {
    defaultformStructure = chatDynamicFormValues[industryName as keyof typeof chatDynamicFormValues];
    const defaultFormIntentName = Object.keys(defaultformStructure)[0]
    defaultIntents = `other\nsite_visit\nschedule_call\nschedule_appointment\n${defaultFormIntentName}`
    defaultNotes = chatIndustryDefaultNotes[industryName as keyof typeof chatIndustryDefaultNotes]?.note;
  }
  
  const bot = await updateBotDetails(botId, {
    ...body,
    ...{ metadata: {
      ui: {
        ...metaData?.ui,
        ...body.metadata?.ui,
        ...body?.logo && { logo: body?.logo },
      },
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
    } },
    ...defaultformStructure && { customForms: defaultformStructure }
  });
 
  return isValidReturnType(event, bot);
});