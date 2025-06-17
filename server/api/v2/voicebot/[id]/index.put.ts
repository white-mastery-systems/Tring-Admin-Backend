import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"

export const zodVoicebotUpdateSchema = z.object({
  name: z.string().optional(),
  active: z.boolean().optional(),
  industryId: z.string().optional(),
  documentId: z.string().optional(),
  llmConfig: z.object({
    top_p: z.string().optional(),
    top_k: z.string().optional(),
    temperature: z.number(),
    max_output_token: z.string(),
    inboundPromptText: z.string(),
    outboundPromptText: z.string()
  }).optional(),
  knowledgeSource: z.enum(["website", "document", "text"]).optional(),
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
      version: z.string(),
      industryType: z.string().optional(),
      role: z.string(),
      goal: z.string(),
      otherRole: z.string().optional(),
      otherGoal: z.string().optional()
  }).optional(),
  textToSpeechConfig: z.record(z.any()).optional(),
  speechToTextConfig: z.record(z.any()).optional(),
  ivrConfig: z.string().optional(),
  incomingPhoneNumber: z.string().optional(),
  preRecordedAudios: z.object({
    welcomeAudio: z.array(z.any()).optional(),
    concludeAudio: z.array(z.any()).optional(),
    fillerAudio: z.array(z.any()).optional(),
    ambientNoiseAudio: z.array(z.any()).optional(),
    forwardCallAudio: z.array(z.any()).optional(),
  }).optional(),
  clientConfig: z.object({
    llmCaching: z.boolean().optional(),
    dynamicCaching: z.boolean().optional(),
    distance: z.number().optional(),
  }).optional(),
  audioFiles: z.record(z.any()).optional(),
  tools: z.object({
    clientTools: z.array(z.any()).optional(),
    defaultTools: z.array(z.string()).optional(),
  }).optional(),
  intent: z.string().optional(),
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
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const body = await isValidBodyHandler(event, zodVoicebotUpdateSchema)

    const voicebotDetail: any = await getVoicebotById(voicebotId)
    
    if(body?.incomingPhoneNumber) {
      const isAlreadyExistPhonenumber = await getVoicebotByIncomingPhoneNumber(body?.incomingPhoneNumber, "update", voicebotId)
      if (isAlreadyExistPhonenumber) {
        return errorResponse(event, 400,  "This phone number is already linked to another bot. Please use a different number.")
      }  
    }
 
    if(body?.botDetails) {
      const botDetails = body?.botDetails
      const callType = body?.botDetails?.callType
      
      if(voicebotDetail.botDetails?.callType !== callType || voicebotDetail?.industryId !== body?.industryId) {
        let voiceInboundPrompt = ""
        let voiceOuboundPrompt = ""
        let knowledgeBase: string = ""
        const industryDetail: any = await getIndustryDetail({ industryId: body?.industryId ?? voicebotDetail?.industryId });
        const industryName = industryDetail.industryName!;
        const orgDetails: any = await getOrganizationById(organizationId)

        if (voicebotDetail?.knowledgeSource === "website") {
          knowledgeBase = voicebotDetail?.websiteContent || ""
        } else if (voicebotDetail?.knowledgeSource === "text") {
          knowledgeBase = voicebotDetail?.textContent || ""
        } else if (voicebotDetail?.knowledgeSource === "document") {
          const document= await getVoicebotDocumentById(voicebotDetail?.documentId!)
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
        body.llmConfig = voicebotDetail?.llmConfig
        body.llmConfig.inboundPromptText = voiceInboundPrompt
        body.llmConfig.outboundPromptText = voiceOuboundPrompt
      }
    }
     
    if(body?.knowledgeSource !== voicebotDetail?.knowledgeSource) {
      if(body?.knowledgeSource === "website") {
        body.textContent = null
      } else if(body?.knowledgeSource === "text") {
        body.websiteLink = null
        body.websiteContent = null
      } else if(body?.knowledgeSource === "document") {
        body.textContent = null
        body.websiteLink = null
        body.websiteContent = null
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

    if(body?.llmConfig) {
      body.llmConfig = {
        ...voicebotDetail?.llmConfig,
        ...body.llmConfig,
      }
    }

    if (body?.ivrConfig === null) {
      body.active = false
    }

    const update = await updateVoiceBot(voicebotId, body)

    return isValidReturnType(event, update)
  } catch (error: any) {
    logger.error(`Voicebot update API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to update the voicebot")
  }
})