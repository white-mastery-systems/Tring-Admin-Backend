import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { createIndustry, getIndustryByName } from "~/server/utils/db/industries"

export default defineEventHandler(async (event) => {
  try {
    const body = await isValidBodyHandler(event, z.object({
      industryName: z.string(),
      organizationId: z.string().optional()
    }))
    
    const organizationId = event?.context?.user?.organizationId ?? body?.organizationId
    if(!organizationId) {
      return errorResponse(event, 401, "UnAuthorized")
    }

    if(body?.industryName.length > 20) {
      return errorResponse(event, 400, "Industry name cannot exceed 20 characters.")
    }

    const convertedName = body?.industryName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')  // Replace spaces with dashes

    const isIndustryNameAlreadyExists = await getIndustryByName({ organizationId, convertedName, originalName: body?.industryName })
    if(isIndustryNameAlreadyExists) {
      return errorResponse(event, 400, "Industry name Already Exists.")
    }

    const industry = await createIndustry({
      data: {
        industryName: body?.industryName,
        organizationId
      }
    })

    return industry
  } catch(error: any) {
    logger.error(`Create industry API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create industry")
  }
})