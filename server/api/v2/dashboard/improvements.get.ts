import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getChatImprovementsByOrgId } from "~/server/utils/db/chats"
import { getVoiceImprovementsByOrgId } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event)
    
    const chatImprovements = await getChatImprovementsByOrgId(organizationId)

    const voiceImprovements = await getVoiceImprovementsByOrgId(organizationId)

    return {
      chatTotalImprovements: chatImprovements.total,
      chatHighPriorityImprovements: chatImprovements.highPriority,
      voiceTotalImprovements: voiceImprovements.total,
      voiceHighPriorityImprovements: voiceImprovements.highPriority,
    }
    

  } catch (error: any) {
    logger.error(`Dashboard Get Improvement API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch dashboard improvements")
  }
})