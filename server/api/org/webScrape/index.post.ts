import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export default defineEventHandler(async (event) => {
  try {
    const body = await isValidBodyHandler(event, z.object({
      url: z.string()
    }))

    const response = await $fetch(`http://148.113.16.40:5010/scrape`, {
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