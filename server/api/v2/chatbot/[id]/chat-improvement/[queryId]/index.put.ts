import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getBotQueriesById, updateBotQueriesById } from "~/server/utils/db/chats"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { id: botId } = await isValidRouteParamHandler(event, checkPayloadId("id"))
    const { queryId } = await isValidRouteParamHandler(event, checkPayloadId("queryId"))

    const body = await isValidBodyHandler(event, z.object({
      answer: z.string().optional(),
      status: z.enum(["ignored"]).optional()
    }))

    await updateBotQueriesById(queryId, body)

    if(body?.answer) {  
      const botDetails = await getBotDetails(botId)
      const botQueries = await getBotQueriesById(queryId)

      const onlyQuestions = botQueries?.instances!
      .map((item: any) => item.question.trim())
      .map((q) => (q.endsWith("?") ? q : q + "?"))
      .join(" ");

      const updatedData = `${onlyQuestions} ${botQueries?.answer || ""}`.trim()

      const updateDocument = await $fetch(`/rag/document/${botDetails?.documentId}`, 
      {
        method: "POST",
        baseURL: config.llmBaseUrl,
        body: {
          content: updatedData,
          originUrl: `${config.public.adminBaseUrl}`
        }
      })

      if(updateDocument) {
        await updateBotQueriesById(queryId, { status: "trained" })
        return true
      } else {  
        return errorResponse(event, 500, "Unable to create response")
      }
    }

    return true
    
  } catch(error: any) {
    logger.error(`Chat improvement update API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create response")
  }
}) 