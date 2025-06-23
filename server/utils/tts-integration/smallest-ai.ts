import { logger } from "~/server/logger"

export const getSmallestAiTtsVoiceList = async (model: string, token: string) => {
  try {
    const data = await $fetch(`https://waves-api.smallest.ai/api/v1/${model}/get_voices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return data

  } catch (error: any) {
    logger.error(`Snallest-AI TTS - get voices API Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}