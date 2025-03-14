import { logger } from "~/server/logger"

export const getElevenlabsModels = async (apiKey: string) => {
  try {
    const modelList = await $fetch("https://api.elevenlabs.io/v1/models", {
      method: "GET",
      headers: {
        "xi-api-key": apiKey
      }
    })
    return modelList
  } catch (error: any) {
    logger.error(`Elevenlabs get models function Error: ${JSON.stringify(error)}`)
    throw new Error(error)
  }
}

export const getElevenlabsVoices = async (apiKey: string) => {
  try {
    const voiceList = await $fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": apiKey
      }
    })
    return voiceList
  } catch (error: any) {
    logger.error(`Elevenlabs get voices function Error: ${JSON.stringify(error)}`)
    throw new Error(error)
  }
}