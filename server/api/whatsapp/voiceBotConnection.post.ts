import { logger } from "~/server/logger";
import { getIntegrationByOrgId } from "./module";

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    organizationId: z.string(),
    phone: z.string(),
    countryCode: z.string(),
    message: z.string(),
    messageType: z.string().default("text").refine((val) => ["text", "template"].includes(val), {
      message: 'messageType must be either "text" or "template"',
    }),
    integrationId: z.string().optional(),
    templateName: z.string().optional(),
    provider: z.string().optional(),
  }))
  try {
    const { organizationId, phone, countryCode, integrationId, messageType, message, templateName} = body

    const integrationDetails = await getIntegrationByOrgId(organizationId, integrationId);

    if (integrationDetails && integrationDetails?.metadata?.pid && integrationDetails?.metadata?.access_token){
      const metaToken = integrationDetails?.metadata?.access_token;
      const pid = integrationDetails?.metadata?.pid
      const userPhone = `${countryCode}${phone}`.replace("+", "").replaceAll(" ", "")

      if(messageType == "template" && templateName){
        const data = await sendWhatsappTemplateMessage(pid, metaToken, userPhone, templateName, [], "en")
        return { status: true, message: "Whatsapp template sent successfully", chatHistory:[], data };
      } else {
        const data = await sendWhatsappMessage(metaToken, pid, userPhone, message);
        return { status: true, message: "Whatsapp message sent successfully", chatHistory:[], data };
      }
    }

    return { status: false, message: "There is no whatsapp connection in your organaization", chatHistory:[]}
  } catch (error:any) {
    logger.error(`Whatsapp voicebot Conection Error: ${error?.message}`)
    return { status: false, message: error?.message, chatHistory:[] };
  }
})