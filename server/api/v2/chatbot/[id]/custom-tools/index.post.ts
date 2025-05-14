import { logger } from "~/server/logger"
import { v4 as uuid } from "uuid";
import { errorResponse } from "~/server/response/error.response"

const zodInsertCustomTool = z.object({
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
    const { id: botId } = await isValidRouteParamHandler(
      event,
      checkPayloadId("id"),
    )
    const body = await isValidBodyHandler(event, zodInsertCustomTool)
    let customTool = body
    if (!customTool) {
      return errorResponse(event, 400, "Custom tools are required")
    }
    
    // return customTool
    
    const botDetails = await getBotDetails(botId)

    const bodyCustomTool = {
      ...customTool,
      isActive: true,
      id: uuid()
    }

    // return customTool

    const botCustomTools = botDetails?.customTools ? [...botDetails?.customTools, bodyCustomTool] : [bodyCustomTool]

    // return botCustomTools

    const updatedChatbot = await updateBotDetails(botId, {
      customTools: botCustomTools
    })
      
    return updatedChatbot

  } catch (error: any) {
    logger.error(`Chatbot custom tools API Error, ${JSON.stringify(error)}`)
    return errorResponse(event, 500, "Unable to create chatbot custom tools")
  }
})