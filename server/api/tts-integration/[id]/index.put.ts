import { errorResponse } from "~/server/response/error.response"
import { isTtsNameAlreadyExists } from "~/server/utils/db/tts-integration"

const zodUpdateTtsIntegration = z.object({
  ttsIntegrationName: z.string().optional(),
  provider: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: ttsIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body: any = await isValidBodyHandler(event, zodUpdateTtsIntegration)

  if(body.provider === "elevenlabs") {
    try {
      await getElevenlabsModels(body?.metadata?.apiKey)
    } catch (error: any) {
      return errorResponse(event, 400, "Invalid elevenlabs API-Key")
    }
  }

  const isAlreadyExists = await isTtsNameAlreadyExists(body?.ttsIntegrationName, ttsIntegrationId)
  if(isAlreadyExists) {
    return errorResponse(event, 400, "TTS integration name already exists")
  }
  
  const data = await updateTtsIntegration(ttsIntegrationId, body)

  return data
})