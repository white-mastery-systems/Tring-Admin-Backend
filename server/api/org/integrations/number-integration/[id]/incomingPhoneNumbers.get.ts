import { getAvailablePhoneNumbers } from "~/server/utils/cloudTelephony"

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const numberIntegration = await getNumberIntegrationById(numberIntegrationId)

  const availablePhoneNumbers = await getAvailablePhoneNumbers(numberIntegration?.provider!, numberIntegration?.metadata)

  return availablePhoneNumbers
})