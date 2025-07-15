import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { ["query-id"]: queryId } = await isValidRouteParamHandler(event, checkPayloadId("query-id"))

    const body = await isValidBodyHandler(event, z.object({
      answer: z.string().optional(),
      status: z.enum(["ignored"]).optional()
    }))
    
    const data = await updateVoicebotImprovementQueries(queryId, {
      ...body,
      status: body?.answer ? "trained" : body?.status
    })
    
    return data
  } catch (error: any) {
    logger.error(`Voicebot - Update queries with answer API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update the voicebot queries with answer")
  }
})