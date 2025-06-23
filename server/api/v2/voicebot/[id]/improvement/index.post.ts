import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createVoicebotImprovementQueries, updateVoicebotImprovementQueries } from "~/server/utils/v2/db/voicebot"

const zodVoicebotImprovementSchema = z.array(
  z.object({
    id: z.string().optional(),
    title: z.string(),
    instances: z.array(z.any()),
    suggestions: z.array(z.string())
}))

export default defineEventHandler(async (event) => {
  try {
    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const body = await isValidBodyHandler(event, zodVoicebotImprovementSchema)
    const voicebotDetail = await getVoicebotById(voicebotId)

    for (const item of body) {
      const payload = {
        ...item,
        botId: voicebotId,
        organizationId: voicebotDetail?.organizationId!,
      };

      if (item?.id) {
        await updateVoicebotImprovementQueries(item.id, payload)
      } else {
        await createVoicebotImprovementQueries(payload)
      }
    }

    return true
  } catch (error: any) {
    logger.error(`Voicebot improvement API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update the improvement for voicebot")
  }
})