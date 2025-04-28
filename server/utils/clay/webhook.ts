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
    const data = await $fetch(`https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-9aa1e131-60e6-4d71-b98f-c65f719c94c2`,
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
