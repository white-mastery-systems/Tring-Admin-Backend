import { logger } from "~/server/logger"

export const playGoogleTtsVoice = async ({ voice }: { voice: string }) => {
  try {
    const data = await $fetch(`https://cloud.google.com/static/text-to-speech/docs/audio/${voice}.wav`, {
      method: "GET"
    })
    return data
  } catch (error: any) {
    logger.error(`Play Google TTS Voice API Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}