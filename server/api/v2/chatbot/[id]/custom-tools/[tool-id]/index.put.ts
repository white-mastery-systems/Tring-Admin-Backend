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
    const { ["tool-id"]: customToolId } = await isValidRouteParamHandler(event, checkPayloadId("tool-id"))

    const body = await isValidBodyHandler(event, zodUpdateCustomTool)
    
    const botDetails = await getBotDetails(botId)
    if (!botDetails) {
      return errorResponse(event, 404, "Chatbot not found")
    } 
    const customTool = botDetails.customTools?.find((tool: any) => tool.id === customToolId)
    if (!customTool) {    
      return errorResponse(event, 404, "Custom tool not found")
    }
    const updatedCustomTool = {
      ...customTool,
      ...body
    }
    const botCustomTools = botDetails?.customTools?.map((tool: any) => {
      if (tool.id === customToolId) {
        return updatedCustomTool
      }
      return tool
    }
    ) || [] 
    const updatedChatbot = await updateBotDetails(botId, {
      customTools: botCustomTools
    })
    return updatedCustomTool
  }
  catch (error: any) {    
    logger.error(`Chatbot Update Custom Tool Error: ${error.message}`)
    return errorResponse(event, 500, "Unable to update custom tool")
  }
})
