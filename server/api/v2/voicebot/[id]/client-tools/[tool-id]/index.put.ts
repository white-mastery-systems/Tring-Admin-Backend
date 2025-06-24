import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

const zodUpdateCustomTool = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  toolApiDetails: z.object({
    url: z.string(),
    method: z.string(),
    headers: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    queryParams: z.array(z.object({
      key: z.string(),
      value: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string()
    })).optional(),
    responseVariables: z.array(z.object({
      key: z.string(),
      value: z.string(),
      type: z.string(),
      required: z.boolean(),
      description: z.string()
    })).optional()
  })
})

export default defineEventHandler(async (event) => { 
  try {
    await isOrganizationAdminHandler(event)
    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    )     
    const { ["tool-id"]: clientToolId } = await isValidRouteParamHandler(event, checkPayloadId("tool-id"))

    const body = await isValidBodyHandler(event, zodUpdateCustomTool)
    
    const botDetails: any = await getVoicebotById(botId)
    if (!botDetails) {
      return errorResponse(event, 404, "Voicebot not found")
    } 
    const clientTool = botDetails.tools.clientTools?.find((tool: any) => tool.id === clientToolId)
    if (!clientTool) {    
      return errorResponse(event, 404, "Client tool not found")
    }
    const updatedClientTool = {
      ...clientTool,
      ...body
    }
    const botClientTools = botDetails.tools.clientTools?.map((tool: any) => {
      if (tool.id === clientToolId) {
        return updatedClientTool
      }
      return tool
    }
    ) || [] 
    await updateVoiceBot(botId, {
      tools: {
        ...botDetails.tools,
        clientTools: botClientTools
      }
    })
    return updatedClientTool
  }
  catch (error: any) {    
    logger.error(`Voicebot Update Client Tool Error: ${error.message}`)
    return errorResponse(event, 500, "Unable to update client tool")
  }
})
