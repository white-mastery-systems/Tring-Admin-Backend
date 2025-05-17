import { logger } from "~/server/logger"
import { v4 as uuid } from "uuid";
import { errorResponse } from "~/server/response/error.response"

const zodInsertClientTool = z.object({
  name: z.string(),
  description: z.string(),
  toolParameters: z.array(z.object({
    key: z.string(), 
    type: z.string(),
    value: z.string(),
    required: z.boolean(),
    description: z.string(),
  })),
  toolApiDetails: z.object({
    url: z.string(),
    method: z.string(),
    headers: z.array(z.object({
      key: z.string(),
      value: z.string()
    })),
    queryParams: z.array(z.object({
      key: z.string(),
      value: z.string()
    })),
    responseVariables: z.array(z.object({
      key: z.string(),
      value: z.string()
    }))
  })
})

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { id: voicebotId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    )
    const body = await isValidBodyHandler(event, zodInsertClientTool)
    let clientTool = body
    if (!clientTool) {
      return errorResponse(event, 400, "Client tools are required")
    }
    
    // return clientTool
    
    const botDetails: any = await getVoicebotById(voicebotId)

    const bodyClientTool = {
      ...clientTool,
      isActive: true,
      id: uuid()
    }

    // return clientTool

    const botClientTools = botDetails?.tools?.clientTools.length ? [...botDetails?.tools?.clientTools, bodyClientTool] : [bodyClientTool]

    // return botClientTools

    const updatedVoicebot = await updateVoiceBot(voicebotId, {
      tools: {
        ...botDetails.tools,
        clientTools: botClientTools,
      }
    })
      
    return updatedVoicebot

  } catch (error: any) {
    logger.error(`Voicebot client tools API Error, ${JSON.stringify(error)}`)
    return errorResponse(event, 500, "Unable to add voicebot client tools")
  }
})