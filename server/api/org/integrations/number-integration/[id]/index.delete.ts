import { getVoicebotByIvrConfigId } from "~/server/utils/db/voicebots"

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event)

  const { id: numberIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const isIntegratedWithVoicebot = await getVoicebotByIvrConfigId(organizationId, numberIntegrationId)

  if(isIntegratedWithVoicebot) {
    await updateVoiceBot(isIntegratedWithVoicebot.id, { 
      active: false,
      ivrConfig: null,
      incomingPhoneNumber: null
    })
  }

  return await deleteNumberIntegration(numberIntegrationId)
})