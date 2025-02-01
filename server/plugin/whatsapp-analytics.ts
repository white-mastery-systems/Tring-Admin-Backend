import { logger } from "../logger"
import * as schedule from "node-schedule"
import { orgTotalWhatappSessions } from "../utils/whatsappAnalytics"

export default defineNitroPlugin(async (event) => {
  try {
    schedule.scheduleJob("0 0 * * *", async () => {  
      logger.info("Running Every 24 hours cron for updating whatsapp sessions")
      await orgTotalWhatappSessions()
    })
  } catch (error: any) {
    logger.error(`Updating Whatsapp total session, Error: ${JSON.stringify(error.message)}`)
  }
})