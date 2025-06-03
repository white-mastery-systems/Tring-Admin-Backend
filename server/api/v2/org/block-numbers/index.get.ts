import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getBlockedNumbers } from "~/server/utils/v2/db/blocked-numbers"
import { zodListQuery } from "~/server/utils/validations"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event) )as string

    const query = await isValidQueryHandler(event, zodListQuery)

    const data = await getBlockedNumbers(organizationId, query)

    return data
  } catch (error: any) {
    logger.error(`Get Block Numbers API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch block numbers")
  }
})