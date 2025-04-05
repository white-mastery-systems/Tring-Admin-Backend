import { errorResponse } from "~/server/response/error.response";
import { getOrgChatBotCount } from "~/server/utils/db/bot";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

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
        const extraBotLimit = Number(planPricingDetail?.extraBotLimit)
        if(orgChatBotCount >= extraBotLimit) {
          return errorResponse(event, 400, `You can create only ${extraBotLimit} extra chatbots for this plan`)
        }
      } else {
        return errorResponse(event, 400, `You can create only ${botPlanLimit} ${botPlanLimit > 1 ? "chatbots" : "chatbot"} for this plan`)
      }
    }

    const body: any = await isValidBodyHandler(event, z.object({
      name: z.string().optional(),
      type: z.string().optional(),
      metadata: z.record(z.any()).optional()
    }))

    const orgDetails = await getOrganizationById(organizationId)

    const randomBotName = generateRandomBotName(orgDetails?.name!)

    const payload = {
      name: body?.name ?? randomBotName,
      type: body?.type ?? "others",
      ...(body?.metadata && {
        metaData: {
          ...body.metadata,
          prompt: {
            ...body?.metadata?.prompt
          },
        }
      }),
      organizationId,
    }

    // return payload
   
    const bot = await createBot(payload);
  
    return bot;
  } catch (error) {

  }
});


const generateRandomBotName = (orgName: string) => {
  const defaultName = `${orgName} - chat bot - ${Math.floor(100 + Math.random() * 900)}`;
  return defaultName
}