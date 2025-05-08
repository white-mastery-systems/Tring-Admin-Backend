import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { getBotDetailsByName } from "~/server/utils/db/bot";
import { getIndustryDetail } from "~/server/utils/db/industries";
import { getChatBotDefaultConfigs } from "~/server/utils/v2/db/chatbot";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  try {
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
  
  let botDetails: any = await getBotDetails(botId);
  let metaData: any = botDetails?.metadata;
  
  const industryDetail = await getIndustryDetail({ industryId: body?.industryId });

  let defaultIntents: string = "", defaultNotes: string = "", defaultformStructure: any;
  
  if(body?.industryId && body?.industryId !== botDetails?.industryId) {
    const chatBotDefaultConfigs = await getChatBotDefaultConfigs(industryDetail)
    defaultIntents = chatBotDefaultConfigs?.defaultIntents
    defaultNotes = chatBotDefaultConfigs?.defaultNotes || ""
    defaultformStructure = chatBotDefaultConfigs?.defaultformStructure
  }
  
  if(body && botDetails?.knowledgeSource !== body?.knowledgeSource) {
    if(body?.knowledgeSource === "website") {
      body.textContent = null
    } else if(body?.knowledgeSource === "text") {
      body.websiteLink = null
      body.websiteContent = null
    } else if(body?.knowledgeSource === "document") {
      body.textContent = null
      body.websiteLink = null
      body.websiteContent = null
    }
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
  } catch (error: any) {
    logger.error(`Chatbot Update API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update chatbot")
  }
});