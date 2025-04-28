import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { chatbotScriptEmailTemplate } from "~/server/utils/chatbotScriptEmailTemplate"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event) as string)
    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const body = await isValidBodyHandler(event, z.object({
      to: z.array(z.string()),
      script: z.string()
    }))

    const botDetails = await getBotDetails(botId)
    const botName = botDetails?.name!

    const adminDetails = await getAdminByOrgId(organizationId)
    
    const emailTemplate: any = chatbotScriptEmailTemplate(adminDetails?.username!, botName, body?.script)

    sendEmail(body?.to, `Integrate ${botName} into Your Website – Easy Setup Instructions`, emailTemplate)

    return { status: true, message: "Email sent successfully" }
    
  } catch (error: any) {
    logger.error(`Sending Email template for chatbot script Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to send chatbot script")
  }
})