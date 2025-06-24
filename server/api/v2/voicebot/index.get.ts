import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

const zodQueryValidator = z.object({
  active: z.string().optional(),
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  industryId: z.string().optional(),
  callType: z.string().optional(),
  language: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
    
    const query = await isValidQueryHandler(event, zodQueryValidator)
    const voiceBotList = await listVoicebots(organizationId, query, timeZone)
    return voiceBotList
  } catch (error: any) {
    logger.error(`Voicebot Get list API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch voicebot list")
  }
})