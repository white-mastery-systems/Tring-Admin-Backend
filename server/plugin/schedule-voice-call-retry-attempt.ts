import { logger } from "../logger"
import * as schedule from 'node-schedule'
import { voicebotDialer } from "../utils/db/voicebotDialer"
import momentTz from "moment-timezone"

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("*/15 * * * *", async () => {  
      logger.info(`Voicebot Failed call - retry scheduler triggered at ,${new Date().toISOString()}`)
       await voicebotRetryScheduler()
    })
  } catch (error: any) {
    logger.error(`Schedule-voicebotDialer Error: ${JSON.stringify(error.message)}`)
  }
})