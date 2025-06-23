import { logger } from "~/server/logger"

export const getNeuphonicTtsVoiceList = async (apiKey: string) => {
  try {
    const data = await $fetch(`https://eu-west-1.api.neuphonic.com/voices`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey
      }
    })
    return data
  } catch (error: any) {
    logger.error(`Neuphonic get voice API Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}