import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getAvailablePhoneNumbers } from "~/server/utils/cloudTelephony"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const numberIntegration: any = await getNumberIntegrationById(numberIntegrationId)

    const availablePhoneNumbers = await getAvailablePhoneNumbers(numberIntegration?.provider!, numberIntegration?.metadata)

    return availablePhoneNumbers
  } catch (error: any) {
    logger.error("Error in get available phone numbers", error.message)
    return errorResponse(event, 500, "Unable to retrieve the incoming phonenumbers")
  }
})