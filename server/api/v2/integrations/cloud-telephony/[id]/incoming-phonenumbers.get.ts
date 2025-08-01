import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getAvailablePhoneNumbers } from "~/server/utils/cloudTelephony"
import { getAllVoicebotTelephoneNumbers } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const numberIntegration: any = await getNumberIntegrationById(numberIntegrationId)

    const availablePhoneNumbers = await getAvailablePhoneNumbers(numberIntegration?.provider!, numberIntegration?.metadata)
    
    const associatedNumbers = await getAllVoicebotTelephoneNumbers()

    // Build a set of valid associated phone numbers (skip empty)
    const associatedSet = new Set(
      associatedNumbers
        .map((n) => n.incomingPhoneNumber?.trim())
        .filter(Boolean)
    );

    // Enrich available numbers inline
    const result = availablePhoneNumbers.map((raw: any) => {
      // Extract leading phone number (e.g., "+918035737074" from "+918035737074 - Tring")
      const match = raw.match(/^\s*([\+\d]+)/);
      const number = match ? match[1] : raw.trim();

      return {
        phoneNumber: raw,
        isAssociated: associatedSet.has(number),
      };
    })
  
    return result
  } catch (error: any) {
    logger.error("Error in get available phone numbers", error.message)
    return errorResponse(event, 500, "Unable to retrieve the incoming phonenumbers")
  }
})