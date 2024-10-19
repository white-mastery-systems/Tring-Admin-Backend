import { updateVoiceBot } from "~/server/utils/db/voicebots";

const db = useDrizzle();

const zodUpdateVoiceBotSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  domain: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  metaData: z.record(z.any()).optional(), // Assuming metaData is a JSON object with any structure
  llmConfig: z
    .object({
      provider: z.string().optional(),
      model: z.string().optional(),
      tokens: z.string().optional(),
      temperature: z.number().optional(),
      documentId: z.string().optional(),
      role: z.string().optional(),
      guide: z.string().optional(),
      instruction: z.string().optional(),
      notes: z.string().optional(),
      domainRules: z.string().optional(),
      prompt: z.string()
    })
    .optional(),
  identityManagement: z
    .object({
      name: z.string().optional(),
      role: z.string().optional(),
      domain: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
  talentConfig: z
    .object({
      name: z.string().optional(),
      type: z.string().optional(),
      size: z.number().optional(),
      url: z.string().optional(),
    })
    .optional(),
  audioFiles: z.record(z.any()).optional(),
  textToSpeechConfig: z.record(z.any()).optional(),
  speechToTextConfig: z.record(z.any()).optional(),
  intents: z.array(z.string()).optional(),
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


  const update = await updateVoiceBot(voicebotId, body);

  return isValidReturnType(event, update);
});
