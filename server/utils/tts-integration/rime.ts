import { logger } from "~/server/logger"

export const getRimeTtsVoiceList = async () => {
  try {
    const data = await $fetch(`https://users.rime.ai/data/voices/all-v2.json`, {
      method: "GET"
    })

    return data

  } catch (error: any) {
    logger.error(`Rime TTS - get voices API Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}