import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { checkIfBlockedNumberExists, createBlockedNumber } from "~/server/utils/v2/db/blocked-numbers"

export default defineEventHandler(async (event) => {
  try { 
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const body = await isValidBodyHandler(event, z.object({
      phoneNumber: z.string(),
      countryCode: z.string(),
      source: z.string().default("manual"),
    }))

    const isAlreadyExists = await checkIfBlockedNumberExists(organizationId, body?.phoneNumber, "create")
    if(isAlreadyExists) {
      logger.error(`Blocked number already exists: phoneNumber: ${body.phoneNumber}, organizationId: ${organizationId}`)   
      return errorResponse(event, 400, "Phonenumber already exists")
    }

    const data = await createBlockedNumber({...body, organizationId })

    return data
  } catch (error: any) {
    logger.error(`Create Block numbers API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unabe to create block numbers")
   }
})