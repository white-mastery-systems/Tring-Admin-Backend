import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    
    const data = await getWhatsappIntegratedChatbots(organizationId)

    return data

  } catch (error: any) {
    logger.error(`Get Whatsapp bots API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch whatsapp bots")
  }
})