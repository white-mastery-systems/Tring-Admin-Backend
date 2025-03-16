import { errorResponse } from "~/server/response/error.response"
import { getTtsIntegrationByName } from "~/server/utils/db/tts-integration"

const zodTtsIntegrationBody = z.object({
  ttsIntegrationName: z.string(),
  provider: z.string(),
  metadata: z.record(z.any()).optional()
})

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string

  const body = await isValidBodyHandler(event, zodTtsIntegrationBody)

  const isExists = await getTtsIntegrationByName(body?.ttsIntegrationName, organizationId)
  if(isExists) {
    return errorResponse(event, 400, "TTS integration name already exists")
  }

  const data = await createTtsIntegration({
    ...body,
    organizationId
  })

  return data
})