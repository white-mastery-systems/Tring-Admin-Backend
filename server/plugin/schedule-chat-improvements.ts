import { logger } from "../logger"
import * as schedule from 'node-schedule'
import { scheduleChatbotImprovement } from "../utils/scheduleChatbotImprovement"

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("0 */8 * * *", async () => {  
      logger.info("Chatbot Improvement cron triggered — running every 8 hours.")
      await scheduleChatbotImprovement()
    })
  } catch (error: any) {
    logger.error(`Schedule-voicebotDialer Error: ${JSON.stringify(error.message)}`)
  }
})