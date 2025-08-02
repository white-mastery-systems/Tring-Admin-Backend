import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event);

    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    );

    const body: any = await isValidBodyHandler(event, z.object({
      leadFormTitle: z.string().min(1, "Lead form title is required"),
      leadFormDescription: z.string(),
      leadNameField: z.boolean(),
      leadEmailField: z.boolean(),
      leadPhoneField: z.boolean(),
      leadWebsiteField: z.boolean(),
      leadFormAdditionalFields: z.array(z.any())
    }));

    const bot = await getBotDetails(botId);
    if (!bot) return errorResponse(event, 404, "Bot not found");

    const data = await updateBotDetails(botId, {
      metadata: {
        ...(bot.metadata as any),
         ui: {
          ...(bot.metadata as { ui: any }).ui,
          leadFormTitle: body.leadFormTitle,
          leadFormDescription: body.leadFormDescription,
          leadNameField: body.leadNameField,
          leadEmailField: body.leadEmailField,
          leadPhoneField: body.leadPhoneField,
          leadWebsiteField: body.leadWebsiteField,
          leadFormAdditionalFields: body.leadFormAdditionalFields || [],
        }
      },
    });

    return data;
  } catch (error: any) {
    logger.error(`Chatbot Lead Generation Form Update API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to update lead generation form of the chatbot");
  }
})