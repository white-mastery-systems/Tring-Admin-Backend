import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    );

    const body: any = await isValidBodyHandler(event, z.object({
      initMessage: z.object({
        role: z.literal("assistant"),
        content: z.string(),
        metadata: z.any().optional(),
      })
    }))

    const bot = await getBotDetails(botId);
    if (!bot) return errorResponse(event, 404, "Bot not found");

    const data = await updateBotDetails(botId, {
      metadata: {
        ...(bot.metadata as any),
        prompt: {
          ...(bot.metadata as { prompt: any }).prompt,
          INITIAL_MESSAGE: body?.initMessage || {},
        }
      }
    })

    return data
  } catch (error: any) {
    logger.error(`Chatbot Init Message Update API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to update init message of the chatbot");
  }
})