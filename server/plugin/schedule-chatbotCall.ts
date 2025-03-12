import { logger } from "../logger"
import * as schedule from 'node-schedule'

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("*/5 * * * *", async () => {  
      logger.info("chatbot - Every 5 mins cron is running for chatbot call scheduling...")
       await chatbotScheduleCall()
    })
  } catch (error: any) {
    logger.error(`Schedule-voicebotDialer Error: ${JSON.stringify(error.message)}`)
  }
})