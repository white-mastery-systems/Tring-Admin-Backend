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
      answer: z.string()
    }))

    const botDetails = await getBotDetails(botId)

    await updateBotQueriesById(queryId, body)

    const botQueries = await getBotQueriesById(queryId)

    const onlyQuestions = botQueries?.instances!
    .map((item: any) => item.question.trim())
    .map((q) => (q.endsWith("?") ? q : q + "?"))
    .join(" ");

    const updatedData = `${onlyQuestions} ${botQueries?.answer || ""}`.trim()

    const updateDocument = await $fetch(`/rag/document/${botDetails?.documentId}`, {
      method: "POST",
      baseURL: config.llmBaseUrl,
      body: {
        content: updatedData,
        originUrl: `https://tring-admin.pripod.com/api/chat-bot/${botId}`
      }
    })

    if(updateDocument) {
      await updateBotQueriesById(queryId, { status: "trained" })
      return updateDocument
    } else {  
      return errorResponse(event, 500, "Unable to create response")
    }
  } catch(error: any) {
    logger.error(`Chat improvement update API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create response")
  }
}) 