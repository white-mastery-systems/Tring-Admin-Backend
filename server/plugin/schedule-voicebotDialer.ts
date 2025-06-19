import { logger } from "../logger"
import * as schedule from 'node-schedule'
import { voicebotDialer } from "../utils/db/voicebotDialer"
import momentTz from "moment-timezone"

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("*/5 * * * *", async () => {  
      logger.info("voicebot - Every 5 mins cron is running for outbound schdeuling...")
       await voicebotCallSchedular()
    })
  } catch (error: any) {
    logger.error(`Schedule-voicebotDialer Error: ${JSON.stringify(error.message)}`)
  }
})