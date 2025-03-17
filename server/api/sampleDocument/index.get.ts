import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, z.object({
      type: z.enum([  
        "real-estate",
        "government-sectors",
        "finance-banking",
        "healthcare",
        "e-commerce",
        "energy-utilities",
        "telecommunications",
        "travel-hospitality",
        "logistics",
        "education-training",
        "it-service"
      ])
    }))

    const documentUrl = `${config.public.adminBaseUrl}/document/${query.type}.pdf`

    return {
      documentName: `${query.type}.pdf`,
      url: documentUrl
    }

  } catch (error: any) {
    logger.error(`Get sample document API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch sample document")
  }
})