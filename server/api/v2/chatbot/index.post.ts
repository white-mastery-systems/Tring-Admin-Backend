import { logger } from "~/server/logger"
import { updateDocument } from "~/server/utils/db/document"
import { errorResponse } from "~/server/response/error.response"
import { getBotDetailsByName } from "~/server/utils/db/bot"

const config = useRuntimeConfig()

export const zodCreateChatbot = z
  .object({
    name: z.string(),
    industryId: z.string(),
    knowledgeSource: z.enum(["website", "document", "text"]),
    websiteLink: z.string().optional(),
    websiteContent: z.string().optional(),
    textContent: z.string().optional(),
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
    console.log("organizationId", organizationId)

    const orgChatSubscription = await getOrgZohoSubscription(organizationId, "chat")
    const orgDetail: any = await getOrganizationById(organizationId)

    let planPricingDetail
  
    if(orgChatSubscription?.pricingPlanCode === "chat_free") {
      planPricingDetail = await getPricingInformation("chat_free")
    } else if (orgChatSubscription?.subscriptionStatus ===  "trial") {
      planPricingDetail = await getPricingInformation("chat_intelligence")
    } else {
      planPricingDetail = await getPricingInformation(orgChatSubscription?.pricingPlanCode!)
    }

    const botPlanLimit = Number(planPricingDetail?.botsAllowed)
    const orgChatBotCount = await getOrgChatBotCount(organizationId)

    if(orgChatBotCount >= botPlanLimit) {
      if(orgDetail?.wallet > 0) {
        const extraBotsUsed = orgChatBotCount - botPlanLimit;
        const extraBotLimit = Number(planPricingDetail?.extraBotLimit)
        if (extraBotsUsed >= extraBotLimit) {
          return errorResponse(event, 400, `You can create only ${extraBotLimit} extra chatbots for this plan`);
        }
        
        const extraOneBotCost = 1 * (planPricingDetail?.extraBotCost || 0)
        if(orgDetail?.wallet >= extraOneBotCost) {
          const remainingAmountInWallet = Math.max(orgDetail?.wallet - extraOneBotCost, 0)
          await updateOrganization(organizationId, { wallet: remainingAmountInWallet })
        } else {
          return errorResponse(event, 400, "Insufficient wallet balance to create an additional chatbot.")
        }
      } else {
        return errorResponse(event, 400, `You can create only ${botPlanLimit} ${botPlanLimit > 1 ? "chatbots" : "chatbot"} for this plan`)
      }
    }
    
    const body: any = await isValidBodyHandler(event, zodCreateChatbot)

    const alreadyExistingBot = await getBotDetailsByName(organizationId, body?.name, "insert")
    if(alreadyExistingBot) {
      return errorResponse(event, 400, "Chatbot name already exists.")
    }

    const industryDetail = await getIndustryDetail({ industryId: body?.industryId });
    const industryName = industryDetail?.industryName;
    
    let defaultIntents: string | undefined, defaultNotes: string | undefined;
    let defaultformStructure : any
    
    defaultNotes = chatIndustryDefaultNotes[industryName as keyof typeof chatIndustryDefaultNotes]?.note;
    defaultformStructure = chatDynamicFormValues[industryName as keyof typeof chatDynamicFormValues];

    const defaultFormIntentName = Object.keys(defaultformStructure)[0]
    defaultIntents = `other\nsite_visit\nschedule_call\nschedule_appointment\n${defaultFormIntentName}`
   
    const payload = {
      ...body,
      ...defaultformStructure && { customForms: defaultformStructure },
      organizationId
    }

    const bot: any = await createBot(payload);
    if(!bot) {
      return errorResponse(event, 400, "Unable to create chatbot")  
    }
   
    const botId = bot?.id
    const doc_id = body?.documentId;

    let document;
    document = await getDocumentById(doc_id);
    document = document?.status !== "ready" ? null : document;
    if(!document) {
      await deleteBot(bot?.id)
      return errorResponse(event, 400, "The provided document is still being processed. Please try again later.")
    }

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
    await updateDocument(updatedChatbot.documentId!, { botId: updatedChatbot.id })
    
    if (defaultIntents) {
      const splitIntents = defaultIntents?.split("\n").filter((intent) => intent === "schedule_call" || intent === "schedule_appointment" || intent === "site_visit")
      const intentData: any = splitIntents?.map((intent: any) => ({
        type: "schedule_form" ,
        intent,
        metadata: {
          "traditionalForm": true,
          "naturalConversation": false
        },
        botId: bot.id,
        organizationId: bot.organizationId,
      }))
      intentData?.push({
        type: "custom",
        intent: defaultFormIntentName,
        metadata: {
          ...defaultformStructure
        },
        botId: bot.id,
        organizationId: bot.organizationId,
      })
      await createBotIntent(intentData)
    }
  
    return isValidReturnType(event, updatedChatbot);
  } catch (error: any) { 
    logger.error(`Chatbot create API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create chatbot")
  }
})