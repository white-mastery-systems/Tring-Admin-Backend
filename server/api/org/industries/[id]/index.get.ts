import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getIndustryDetail } from "~/server/utils/db/industries"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const { id: industryId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const data = await getIndustryDetail({ industryId })

    return isValidReturnType(event, data)
    
  } catch (error: any) {
    logger.error(`Get industry detail API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch Industry")
  }
})