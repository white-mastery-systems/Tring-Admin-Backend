import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { deleteVoicebotCaches } from "~/server/utils/v2/db/voicebot"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const { id: botId } = await isValidQueryHandler(event, checkPayloadId("id"))

    const query = await isValidQueryHandler(event, z.object({
      audioId: z.string()
    }))

    const isClearAll = query.audioId === "all"

    await $fetch(`${config.public.voiceBotBaseUrl}/deleteCache`, {
      method: "DELETE",
      query: {
        botId,
        orgId: organizationId,
        audioId
      }
    })

    await deleteVoicebotCaches(botId, isClearAll, query.audioId);

    return true;
  } catch (error: any) {
    logger.error(`Delete Voicebot Cache API Error: ${error.message}`);
    return errorResponse(event, 500, "Unable to delete voicebot caches");
  }
});
