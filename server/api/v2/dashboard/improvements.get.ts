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
      chatTotalImprovements: chatImprovements.totalImprovements,
      chatHighPriorityImprovements: chatImprovements.highPriorityImprovements,
      chatHealthScore: chatImprovements.healthScore,
      voiceTotalImprovements: voiceImprovements.totalImprovements,
      voiceHighPriorityImprovements: voiceImprovements.highPriorityImprovements,
      voiceHealthScore: voiceImprovements.healthScore,
    }
    

  } catch (error: any) {
    logger.error(`Dashboard Get Improvement API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch dashboard improvements")
  }
})