import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getVoicebotDocumentById } from "~/server/utils/db/document";
import { getVoicebotByIncomingPhoneNumber } from "~/server/utils/db/voicebots";
import { getVoicebotPromptTextByIndustryType } from "~/server/utils/voicebot";

export const zodNewVoicebotSchema = z.object({
  name: z.string(),
  active: z.boolean().optional(),
  industryId: z.string(),
  documentId: z.string().optional(),
  llmConfig: z.object({
    top_k: z.string(),
    top_p: z.string(),
    temperature: z.number(),
    max_output_token: z.string(),
  }),
  knowledgeSource: z.enum(["website", "document", "text"]),
  websiteLink: z.string().optional(),
  websiteContent: z.string().optional(),
  textContent: z.string().optional(),
  documentContent: z.string().optional(),
  botDetails: z
    .object({
      agentName: z.string(),
      agentLanguage: z.string(),
      region: z.string(),
      timezone: z.string(),
      callType: z.string(),
      industryType: z.string().optional(),
      role: z.string(),
      goal: z.string(),
      otherRole: z.string().optional(),
      otherGoal: z.string().optional()
    }),
  textToSpeechConfig: z.record(z.any()),
  speechToTextConfig: z.record(z.any()),
  ivrConfig: z.string(),
  incomingPhoneNumber: z.string(),
}).superRefine((data, ctx) => {
    const source = data.knowledgeSource;

    if (source === "website") {
      if (!data.websiteLink) {
        ctx.addIssue({
          path: ["websiteLink"],
          code: z.ZodIssueCode.custom,
          message: "websiteLink is required when knowledgeSource is 'website'",
        });
      }
      if (!data.websiteContent) {
        ctx.addIssue({
          path: ["websiteContent"],
          code: z.ZodIssueCode.custom,
          message: "websiteContent is required when knowledgeSource is 'website'",
        });
      }
    }

    if (source === "text" && !data.textContent) {
      ctx.addIssue({
        path: ["textContent"],
        code: z.ZodIssueCode.custom,
        message: "textContent is required when knowledgeSource is 'text'",
      });
    }

     if (source === "document" && !data.documentId) {
      ctx.addIssue({
        path: ["documentId"],
        code: z.ZodIssueCode.custom,
        message: "documentId is required when knowledgeSource is 'document'",
      });
    }
});

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const body = await isValidBodyHandler(event, zodNewVoicebotSchema)

    const isAlreadyExistPhonenumber = await getVoicebotByIncomingPhoneNumber(body?.incomingPhoneNumber, "insert")
    if (isAlreadyExistPhonenumber) {
      return errorResponse(event, 400,  "This phone number is already linked to another bot. Please use a different number.")
    }

    const sttData = updateVoicebotConfig(
      defaultSpeechToTextConfig,
      body.speechToTextConfig,
    );
    body.speechToTextConfig = sttData;

    const ttsData = updateVoicebotConfig(
      defaultTextToSpeechConfig,
      body.textToSpeechConfig,
    );
    body.textToSpeechConfig = ttsData;

    const industryDetail: any = await getIndustryDetail({ industryId: body?.industryId });
    const industryName = industryDetail.industryName!;

    const orgDetails: any = await getOrganizationById(organizationId)

    const botDetails = body?.botDetails
    const callType = botDetails?.callType
  
    let voiceInboundPrompt = ""
    let voiceOuboundPrompt = ""
    let knowledgeBase: string = ""

    if (body?.knowledgeSource === "website") {
      knowledgeBase = body?.websiteContent || ""
    } else if (body?.knowledgeSource === "text") {
      knowledgeBase = body?.textContent || ""
    } else if (body?.knowledgeSource === "document") {
      const document= await getVoicebotDocumentById(body?.documentId!)
      knowledgeBase = document?.documentContent || ""
    }

    const voicebotPrompts = getVoicebotPromptTextByIndustryType({ 
      industryType: industryName, 
      name: botDetails?.agentName, 
      role: botDetails.role === "custom" ? botDetails.otherRole : botDetails.role, 
      goal: botDetails.goal === "custom" ? botDetails.otherGoal : botDetails.goal,
      companyName: orgDetails?.name!, 
      knowledgeBase,
    })

    if(callType === "inbound") {
      voiceInboundPrompt = voicebotPrompts.inboundPrompt
    } else if (callType === "outbound") {
      voiceOuboundPrompt = voicebotPrompts.outboundPrompt
    } else if (callType === "both") {
      voiceInboundPrompt = voicebotPrompts.inboundPrompt
      voiceOuboundPrompt = voicebotPrompts.outboundPrompt
    }

    body.llmConfig.inboundPromptText = voiceInboundPrompt
    body.llmConfig.outboundPromptText = voiceOuboundPrompt

    const voiceBot = await createVoicebot({
      organizationId,
      active: true,
      ...body,
    })

    // Update the voicebotId in document table
    await updateVoicebotDocument(voiceBot.documentId!, { voicebotId: voiceBot.id })
    return isValidReturnType(event, voiceBot);
  } catch (error: any) {
    logger.error(`Voicebot creation API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create voicebot")
  }
})