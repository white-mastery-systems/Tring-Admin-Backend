import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getAllIndustries } from "~/server/utils/db/industries"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    let data = await getAllIndustries({ organizationId })

    return data

  } catch(error: any) {
    logger.error(`Get All Industries API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch Industries")
  }
})