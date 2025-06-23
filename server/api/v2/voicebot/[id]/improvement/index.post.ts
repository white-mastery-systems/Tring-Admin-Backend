import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createVoicebotImprovementQueries, updateVoicebotImprovementQueries } from "~/server/utils/v2/db/voicebot"

const zodVoicebotImprovementSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  instances: z.array(z.any()),
  suggestions: z.array(z.string())
})

export default defineEventHandler(async (event) => {
  try {
    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const body = await isValidBodyHandler(event, zodVoicebotImprovementSchema)
     
    const voicebotDetail = await getVoicebotById(voicebotId)

    const voicebotResponseImprovement = {
      ...body,
      botId: voicebotId,
      organizationId: voicebotDetail?.organizationId!,
    }

    if(voicebotResponseImprovement.id) {
      const updatedQueries = await updateVoicebotImprovementQueries(voicebotResponseImprovement.id, voicebotResponseImprovement)
      return updatedQueries
    }

    const createBotQueries = await createVoicebotImprovementQueries(voicebotResponseImprovement)

    return createBotQueries

  } catch (error: any) {
    logger.error(`Voicebot improvement API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update the improvement for voicebot")
  }
})