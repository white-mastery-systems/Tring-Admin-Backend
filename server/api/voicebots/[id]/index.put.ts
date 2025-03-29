import { updateVoiceBot } from "~/server/utils/db/voicebots";
import {
  defaultSpeechToTextConfig,
  defaultTextToSpeechConfig,
  getInboundPromptByIndustryType,
  updateVoicebotConfig,
} from "~/server/utils/voicebot";

const db = useDrizzle();

const zodUpdateVoiceBotSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  domain: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  metaData: z.record(z.any()).optional(), // Assuming metaData is a JSON object with any structure
  llmConfig: z.record(z.any()).optional(),
  identityManagement: z.record(z.any()).optional(),
  knowledgeBase: z.string().optional(),
  botDetails: z
    .object({
      agentName: z.string().optional(),
      agentLanguage: z.string().optional(),
      region: z.string().optional(),
      timezone: z.string().optional(),
      callType: z.string().optional(),
      industryType: z.string().optional(),
      role: z.string().optional(),
      goal: z.string().optional(),
      otherRole: z.string().optional(),
      otherGoal: z.string().optional()
    })
    .optional(),
  preRecordedAudios: z
    .object({
      welcomeAudio: z.array(z.any()).optional(),
      concludeAudio: z.array(z.any()).optional(),
      fillerAudio: z.array(z.any()).optional(),
      ambientNoiseAudio: z.array(z.any()).optional(),
      forwardCallAudio: z.array(z.any()).optional(),
    })
    .optional(),
  clientConfig: z
    .object({
      llmCaching: z.boolean().optional(),
      dynamicCaching: z.boolean().optional(),
      distance: z.number().optional(),
    })
    .optional(),
  audioFiles: z.record(z.any()).optional(),
  tools: z.record(z.any()).optional(),
  intent: z.string().optional(),
  textToSpeechConfig: z.record(z.any()).optional(),
  speechToTextConfig: z.record(z.any()).optional(),
  ivrConfig: z.any().optional(),
  incomingPhoneNumber: z.any().optional(),
});

export default defineEventHandler(async (event) => {
  const organizationId = await isOrganizationAdminHandler(event);
  const { id: voicebotId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const body: any = await isValidBodyHandler(event, zodUpdateVoiceBotSchema);

  const orgDetails = await getOrganizationById(organizationId)

  if (body?.ivrConfig) {
    const voiceBot = await db.query.voicebotSchema.findFirst({
      where: and(
        eq(voicebotSchema.incomingPhoneNumber, body?.incomingPhoneNumber),
        ne(voicebotSchema.id, voicebotId),
      ),
    });

    if (voiceBot) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage:
            "Phone Number Already Mapped: This phone number is already linked to another bot. Please use a different number.",
        }),
      );
    }
  }

  if (body?.speechToTextConfig) {
    const data = updateVoicebotConfig(
      defaultSpeechToTextConfig,
      body.speechToTextConfig,
    );
    body.speechToTextConfig = data;
  }

  if (body?.textToSpeechConfig) {
    const data = updateVoicebotConfig(
      defaultTextToSpeechConfig,
      body.textToSpeechConfig,
    );
    body.textToSpeechConfig = data;
  }
  
  const botDetails = body?.botDetails
  const callType = botDetails?.callType
  const industryType = botDetails?.industryType
  const llmConfig = body?.llmConfig

  let voiceInboundPrompt, voiceOuboundPrompt

  if(callType && industryType && llmConfig && Object.keys(llmConfig?.inboundPrompt).length === 0 && Object.keys(llmConfig?.outboundPrompt).length === 0) {
    const voicebotPrompts = getInboundPromptByIndustryType({ 
      industryType, 
      name: botDetails?.agentName, 
      role: botDetails?.role === "custom" ? botDetails?.otherRole : botDetails?.role, 
      goal: botDetails?.goal === "custom" ? botDetails?.otherGoal : botDetails?.goal,
      companyName: orgDetails?.name!, 
      knowledgeBase: body?.knowledgeBase 
    })
    if(callType === "inbound") {
      voiceInboundPrompt = voicebotPrompts.inboundPrompt
    } else if (callType === "outbound") {
      voiceOuboundPrompt = voicebotPrompts.outboundPrompt
    } else if (callType === "both") {
      voiceInboundPrompt = voicebotPrompts.inboundPrompt
      voiceOuboundPrompt = voicebotPrompts.outboundPrompt
    }
    body.llmConfig.inboundPrompt = voiceInboundPrompt || {}
    body.llmConfig.outboundPrompt = voiceOuboundPrompt || {}
  }

  if (body.ivrConfig === null) {
    body.active = false;
  }

  const update = await updateVoiceBot(voicebotId, body);

  return isValidReturnType(event, update);
});
