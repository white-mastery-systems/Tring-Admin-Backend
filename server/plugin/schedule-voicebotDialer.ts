import { logger } from "../logger"
import * as schedule from 'node-schedule'
import { voicebotDialer } from "../utils/db/voicebotDialer"

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("*/5 * * * *", async () => {  
      logger.info("Every 5 mins cron is running for outbound call schdeuling...")
      await voicebotDialer()
    })
  } catch (error: any) {
    logger.error(`Schedule-voicebotDialer Error: ${JSON.stringify(error.message)}`)
  }
})