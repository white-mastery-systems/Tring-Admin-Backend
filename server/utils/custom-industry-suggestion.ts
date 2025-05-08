import { logger } from "../logger"

export const getCustomIndustrySuggestions = async (industryName: string) => {
  try {
    const data: any = await $fetch(`/api/custom-industry-suggestions`, {
      method: "POST",
      body: {
        industry: industryName
      }
    })

    return data
  } catch (error: any) {
    logger.error(`Custom industry suggestion API Error: ${JSON.stringify(error.message)}`)
  }
}