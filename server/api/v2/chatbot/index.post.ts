import { logger } from "~/server/logger"
import { updateDocument } from "~/server/utils/db/document"
import { errorResponse } from "~/server/response/error.response"
import { createChatBotDefaultIntents, getChatBotDefaultConfigs, getChatSubscriptionPlanCode, handleChatBotLimitExceeded } from "~/server/utils/v2/db/chatbot"

const config = useRuntimeConfig()

export const zodCreateChatbot = z
  .object({
    name: z.string(),
    industryId: z.string(),
    knowledgeSource: z.enum(["website", "document", "text"]),
    websiteLink: z.string().optional(),
    websiteContent: z.string().optional(),
    textContent: z.string().optional(),
    color: z.string().optional(),
    onlineStatus: z.boolean().optional(),
    documentId: z.string(),
    logo: z.record(z.any()),
    prompt: z.record(z.any()),
  })
  .superRefine((data, ctx) => {
    const source = data.knowledgeSource;

    if (source === "website") {
      if (!data.websiteLink) {
        ctx.addIssue({
          path: ["websiteLink"],
          code: z.ZodIssueCode.custom,
          message: "websiteLink is required when knowledgeSource is 'website'",
        });
      }
      if (!data.websiteContent) {
        ctx.addIssue({
          path: ["websiteContent"],
          code: z.ZodIssueCode.custom,
          message: "websiteContent is required when knowledgeSource is 'website'",
        });
      }
    }

    if (source === "text" && !data.textContent) {
      ctx.addIssue({
        path: ["textContent"],
        code: z.ZodIssueCode.custom,
        message: "textContent is required when knowledgeSource is 'text'",
      });
    }
});

export default defineEventHandler(async (event) => { 
  try {
    const organizationId = await isOrganizationAdminHandler(event) as string

    const [orgChatSubscription, orgDetail] = await Promise.all([
      getOrgZohoSubscription(organizationId, "chat"),
      getOrganizationById(organizationId)
    ]);

    const planPricingDetail = await getChatSubscriptionPlanCode(orgChatSubscription)

    const botPlanLimit = Number(planPricingDetail?.botsAllowed)
    const orgChatBotCount = await getOrgChatBotCount(organizationId, orgChatSubscription?.startDate!, orgChatSubscription?.endDate!);
    
    if(orgChatBotCount >= botPlanLimit) {
      await handleChatBotLimitExceeded(orgDetail, planPricingDetail, orgChatBotCount, botPlanLimit, event);
    }
    
    const body: any = await isValidBodyHandler(event, zodCreateChatbot)

    const industryDetail = await getIndustryDetail({ industryId: body?.industryId });

    const chatBotDefaultConfigs = await getChatBotDefaultConfigs(industryDetail)
    const defaultIntents = chatBotDefaultConfigs?.defaultIntents
    const defaultformStructure = chatBotDefaultConfigs?.defaultformStructure
    const defaultFormIntentName = chatBotDefaultConfigs?.defaultFormIntentName
    const defaultNotes = chatBotDefaultConfigs?.defaultNotes
   
    const payload = {
      ...body,
      ...defaultformStructure && { customForms: defaultformStructure },
      organizationId
    }

    const bot: any = await createBot(payload);
    const botId = bot?.id
    const doc_id = body?.documentId;

    let document;
    document = await getDocumentById(doc_id);
    if(!document) return errorResponse(event, 404, "Document not found");

    document = document?.status !== "ready" ? null : document;
    if(!document) {
      await deleteBot(bot?.id)
      return errorResponse(event, 400, "The provided document is still being processed. Please try again later.")
    }
    
    // Chatbot Deployment
    let INITIAL_MESSAGE = null;
    let max_retries = 5;
    while (max_retries > 0) {
      try {
        const _initialMessage = await $fetch<any>(
          `/api/bot/${botId}/init-message`,
          {
            method: "POST",
            baseURL: config.public.chatBotBaseUrl,
            body: { doc_id },
          },
        );

        JSON.parse(_initialMessage.content);
        INITIAL_MESSAGE = _initialMessage as {};
        break;
      } catch (e) {
        max_retries -= 1;
        continue;
      }
    }

    if (max_retries === 0) {
      await deleteBot(bot?.id)
      return errorResponse(event, 500, "Bot Deployment failed: could not retrieve initial message from the server.")
    }

    const updatedChatbot = await updateBotDetails(bot.id, {
      metadata: {
        ui: {
          ...bot?.metadata.ui,
          ...body?.color && { color: body?.color },
          ...body?.onlineStatus && { onlineStatus: body?.onlineStatus },
          logo: body?.logo,
        },
        prompt: {
          ...bot?.metadata.prompt,
          ...body?.prompt,
          INITIAL_MESSAGE,
          ...defaultIntents && { 
            INTENTS: defaultIntents
          },
          ...defaultNotes && {
            NOTES: defaultNotes
          }
        },
      },
      status: "active",
    })
    
    // Update the botId in document table
    await updateDocument(updatedChatbot.documentId!, { botId: updatedChatbot.id })
    
    // Chatbot Default Intents Creation
    if (defaultIntents) {
      await createChatBotDefaultIntents(defaultIntents, defaultFormIntentName, defaultformStructure, bot?.id, organizationId)
    }
  
    return isValidReturnType(event, updatedChatbot);
  } catch (error: any) { 
    logger.error(`Chatbot create API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create chatbot")
  }
})