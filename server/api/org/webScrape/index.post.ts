import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, z.object({
      type: z.enum(["chat", "voice"])
    }))
    const body = await isValidBodyHandler(event, z.object({
      url: z.string()
    }))

    const response = await $fetch(`http://148.113.16.40:5010/${query.type === "chat" ? "scrape" : "voice-scrape"}`, {
      method: "POST",
      body: {
        urls: [
          body.url
        ]
      }
    })
    return response
  } catch(error: any) {
    logger.error(`Web scraping API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500)
  }
})