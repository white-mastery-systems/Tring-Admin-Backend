
import { logger } from "~/server/logger"

const config = useRuntimeConfig()

export const getDeepgramTtsModels = async () => {
  try {
    const data: any = await $fetch("https://api.deepgram.com/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Token ${config.deepgramTtsApiKey}`
      }
    })

    return data.tts
  } catch(error: any) {
    logger.error(`Deepgram get models function Error: ${JSON.stringify(error)}`)
    throw new Error(error)
  }
} 