import { logger } from "~/server/logger"

export const getCartesiaTtsVoiceList = async (apiKey: string) => {
  try {
    const data = await $fetch(`https://api.cartesia.ai/voices/`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Cartesia-Version": "2025-04-16"
      }
    })
    return data
  } catch (error: any) {
    logger.error(`Cartesia get voice API Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}