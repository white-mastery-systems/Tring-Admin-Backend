import { createVoicebot } from "~/server/utils/db/voicebots";

export const zodVoicebotSchema = z.object({
  name: z.string(),
  active: z.boolean().optional(),
  metaData: z.record(z.any()).optional(), // Assuming metaData is a JSON object with any structure
  llmConfig: z.record(z.any()).optional(), // Assuming llmConfig is a JSON object with any structure
  defaultIntents: z.array(z.string()).optional(),
  ivrConfig: z.record(z.any()).optional(),
})

export default defineEventHandler(async(event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const body = await isValidBodyHandler(event, zodVoicebotSchema)

  const voiceBot = await createVoicebot({
    ...body,
    organizationId,
  })

  return voiceBot
})