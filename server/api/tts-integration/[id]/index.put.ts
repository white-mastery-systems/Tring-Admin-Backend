import { errorResponse } from "~/server/response/error.response"
import { isTtsNameAlreadyExists } from "~/server/utils/db/tts-integration"
import { providerConfigMap } from "../index.post"

const zodUpdateTtsIntegration = z.object({
  ttsIntegrationName: z.string().optional(),
  provider: z.enum(["elevenlabs", "cartesia", "rime", "neuphonic", "smallestai"]),
  metadata: z.record(z.any()).optional()
})

export default defineEventHandler(async (event) => {
  await isOrganizationAdminHandler(event)

  const { id: ttsIntegrationId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

  const body: any = await isValidBodyHandler(event, zodUpdateTtsIntegration)

  const config = providerConfigMap[body?.provider];
  if (config) {
    try {
      await config.validate(body?.metadata?.apiKey || "");
    } catch {
      return errorResponse(event, 400, config.errorMessage);
    }
  }

  const isAlreadyExists = await isTtsNameAlreadyExists(body?.ttsIntegrationName, ttsIntegrationId)
  if(isAlreadyExists) {
    return errorResponse(event, 400, "TTS integration name already exists")
  }
  
  const data = await updateTtsIntegration(ttsIntegrationId, body)

  return data
})