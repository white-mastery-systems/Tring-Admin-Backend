import { logger } from "~/server/logger"

// demo purpose
export const pushChatLeadsToClay = async ({ body } : { body: any }) => {
  try {
    const data = await $fetch(`https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-1f37a9d1-d714-4b30-b684-7fc60efdc8c3`,
    {
      method: "POST",
      body
    })
    return data
  } catch (error: any) {
    logger.error(`push Chat-Leads to Clay: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const pushCallLogsToYourstoreClay = async ({ body } : { body: any }) => {
  try {
    const data = await $fetch(`https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-9aa1e131-60e6-4d71-b98f-c65f719c94c2`,
    {
      method: "POST",
      body
    })
    return data
  } catch (error: any) {
    logger.error(`push CallLogs to Yourstore-Clay Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const pushCallLogsToAkkuClay = async ({ body } : { body: any }) => {
  try {
    const data = await $fetch(`https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-f76edcd7-7e76-4d39-b1af-586dc157d238`,
    {
      method: "POST",
      body
    })
    return data
  } catch (error: any) {
    logger.error(`push CallLogs To Akku-Clay Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}
