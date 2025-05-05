import { logger } from "~/server/logger"
import { updateDocument } from "~/server/utils/db/document"
import { errorResponse } from "~/server/response/error.response"

const config = useRuntimeConfig()

const zodCreateChatbot = z.object({
  name: z.string(),
  industryId: z.string(),
  documentId: z.string(),
  logo:  z.record(z.any()),
  prompt: z.record(z.any()),
})

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
    document = await isValidReturnType(event, document);

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

    if (max_retries === 0) return sendError(event, createError({ statusCode: 500 }));
  
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