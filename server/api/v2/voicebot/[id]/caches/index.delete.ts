import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { deleteVoicebotCaches } from "~/server/utils/v2/db/voicebot"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const { id: botId } = await isValidQueryHandler(event, checkPayloadId("id"))

    const query = await isValidQueryHandler(event, z.object({
      audioId: z.string().optional(),
      clearAll: z.string().optional()
    }))

    const isClearAll = query.clearAll === "true"
    const audioId = isClearAll ? "all" : query.audioId

    await $fetch(`${config.public.voiceBotBaseUrl}/deleteCache`, {
      method: "DELETE",
      query: {
        botId,
        orgId: organizationId,
        audioId
      }
    })

    await deleteVoicebotCaches(isClearAll ? "true" : "false", botId, isClearAll ? undefined : audioId);

    return true;
  } catch (error: any) {
    logger.error(`Delete Voicebot Cache API Error: ${error.message}`);
    return errorResponse(event, 500, "Unable to delete voicebot caches");
  }
});
