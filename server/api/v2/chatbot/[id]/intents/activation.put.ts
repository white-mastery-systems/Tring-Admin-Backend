import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { updateIntentsActiveStatus } from "~/server/utils/db/bot"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)

    const body = await isValidBodyHandler(event, z.object({
      type: z.string(),
      intentId: z.string().optional(),
      isActive: z.boolean(),
    }).refine(
      (data) => data.type !== "custom" || !!data.intentId,
      {
        message: "intentId is required when type is 'custom'",
        path: ["intentId"],
      }
    ))

    const { id: botId } = await isValidRouteParamHandler(event, z.object({
      id: z.string().uuid(),
    }))

    if(body.type === "lead_generation_form") {
      let botDetails: any = await getBotDetails(botId)
      
      const updatedMetadata = {
        ...botDetails.metadata,
        ui: {
          ...botDetails.metadata.ui,
          generateLead: body?.isActive
        },
      };
  
      const payload = {
        ...botDetails,
        metadata: updatedMetadata,
      };
  
      await updateBotDetails(botId, payload) 

      return true
    }  

    if(body?.type === "custom" && body?.intentId) {
      await updateBotIntent(botId, body?.intentId, {
        isActive: body?.isActive
      });

      return true
    }

    await updateIntentsActiveStatus(botId, body.type, body.isActive)

    return true

  } catch (error: any) {
    logger.error(`Chatbot intents activation error, ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Failed to enable/disable intent")
  }
})
