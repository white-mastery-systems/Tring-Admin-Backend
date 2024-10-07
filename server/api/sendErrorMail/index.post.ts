import { logger } from "~/server/logger"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const recipients = ["sainath@whitemastery.com", "rianozal@gmail.com", "johnbabu@whitemastery.com", "purushothaman@whitemastery.com" ]
    const errorMessage = body?.message
    sendEmail(recipients,"LLM Server Failed", errorMessage)
    return { status: true }
  } catch(error) {
    logger.error(`Error: send error mail, ${error}`)
    return { status: false }
  }
})