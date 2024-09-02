import { updateVoiceBot } from "~/server/utils/db/voicebots";
import { zodVoicebotSchema } from "../index.post";

const zodUpdateVoiceBotSchema = z.object({
  name: z.string().optional(),
  active: z.boolean().optional(),
  metaData: z.record(z.any()).optional(), // Assuming metaData is a JSON object with any structure
  llmConfig: z.record(z.any()).optional(), // Assuming llmConfig is a JSON object with any structure
  defaultIntents: z.array(z.string()).optional(),
  ivrConfig: z.record(z.any()).optional(),
})

export default defineEventHandler(async(event) => {
  await isOrganizationAdminHandler(event)
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );
  
  const body = await isValidBodyHandler(event, zodUpdateVoiceBotSchema)

  const update = await updateVoiceBot(voicebotId, body)

  return update
})