import { errorResponse } from "~/server/response/error.response";
import { z } from "zod";
import { checkBotNameExists } from "~/server/utils/v2/db/organization";
import { logger } from "~/server/logger";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event) as string;

    const body: any = await isValidBodyHandler(
      event,
      z.object({
        botName: z.string().min(1, "Bot name is required"),
        type: z.enum(["chatbot", "voicebot"]),
        id: z.string().optional(), // used for edit to exclude self
      })
    );

    const { botName, type, id } = body;

    const isAlreadyExists = await checkBotNameExists(
      organizationId,
      botName,
      type,
      id
    );

    return isAlreadyExists
  } catch (error: any) {
    logger.error(`Error in check-bot-name API: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to check bot name");
  }
});
