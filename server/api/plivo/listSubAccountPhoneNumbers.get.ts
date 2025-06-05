import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { listPlivoSubAccountPhoneNumbers } from "~/server/utils/plivo"

export default defineEventHandler(async (event) => {
  try {
    await isOrganizationAdminHandler(event)
    const query = await isValidQueryHandler(event, z.object({
      authId: z.string(),
      authToken: z.string(),
      country: z.string().default("US"),
      page: z.string(),
      limit: z.string()
    }))
    const data = await listPlivoSubAccountPhoneNumbers({
      subAccountAuthId: query.authId,
      subAccountAuthToken: query.authToken,
      country: query.country,
      page: query.page,
      limit: query.limit
    })
    return data
  } catch (error: any) {
    logger.error(`Plivo List Sub-account PhoneNumbers API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch sub-account phonenumbers in Plivo")
  }
})