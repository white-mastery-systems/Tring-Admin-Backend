import { logger } from "~/server/logger"

// demo purpose
export const insertRecordsInClay = async ({ body } : { body: any }) => {
  try {
    const data = await $fetch(`https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-1f37a9d1-d714-4b30-b684-7fc60efdc8c3`,
    {
      method: "POST",
      body
    })
    return data
  } catch (error: any) {
    logger.error(`Insert Records in Clay: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const insertCallLogsInClay = async ({ body } : { body: any }) => {
  try {
    const data = await $fetch(`https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-c5a30595-0f9c-4824-ad7a-b028fe0b383f`,
    {
      method: "POST",
      body
    })
    return data
  } catch (error: any) {
    logger.error(`Insert Call-logs in Clay: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}