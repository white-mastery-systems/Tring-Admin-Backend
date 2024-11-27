import { updateVoiceBot } from "~/server/utils/db/voicebots";
import { defaultSpeechToTextConfig, defaultTextToSpeechConfig, updateVoicebotConfig } from "~/server/utils/voicebot";

const db = useDrizzle();

const zodUpdateVoiceBotSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  domain: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  metaData: z.record(z.any()).optional(), // Assuming metaData is a JSON object with any structure
  llmConfig: z.record(z.any()).optional(),
  identityManagement: z.record(z.any()).optional(),
  botDetails: z.object({
    agentName: z.string().optional(),
    agentLanguage: z.string().optional()
  }).optional(),
  preRecordedAudios: z.object({
    welcomeAudio: z.array(z.any()).optional(),
    concludeAudio: z.array(z.any()).optional()
  }).optional(),
  clientConfig: z.object({
    llmCaching: z.boolean().optional(),
    dynamicCaching: z.boolean().optional(),
    distance: z.number().optional()
  }).optional(),
  audioFiles: z.record(z.any()).optional(),
  tools: z.record(z.any()).optional(),
  intent: z.string().optional(),
  textToSpeechConfig: z.record(z.any()).optional(),
  speechToTextConfig: z.record(z.any()).optional(),
  ivrConfig: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event);
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body: any = await isValidBodyHandler(event, zodUpdateVoiceBotSchema);
  
  if(body?.ivrConfig) {
    const voiceBot = await db.query.voicebotSchema.findFirst({ 
      where: eq(voicebotSchema.ivrConfig, body?.ivrConfig)
    })

    if(voiceBot) {
      return sendError(
        event,
        createError({ 
          statusCode: 400, 
          statusMessage: "This ivr-configuration already integrated with some other bot" 
        }),
      );
    }
  }

  if(body.speechToTextConfig) {
    const data = updateVoicebotConfig(defaultSpeechToTextConfig, body.speechToTextConfig);
    body.speechToTextConfig = data
  }

  if(body.textToSpeechConfig) {
    const data = updateVoicebotConfig(defaultTextToSpeechConfig, body.textToSpeechConfig);
    body.textToSpeechConfig = data
  }

  const update = await updateVoiceBot(voicebotId, body);

  return isValidReturnType(event, update);
});
