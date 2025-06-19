import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { zodUpdateNewVoicebotSchema } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string

    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

    const body = await isValidBodyHandler(event, zodUpdateNewVoicebotSchema)

    const voicebotDetail: any = await getVoicebotById(voicebotId)
    
    if(body?.incomingPhoneNumber) {
      const isAlreadyExistPhonenumber = await getVoicebotByIncomingPhoneNumber(body?.incomingPhoneNumber, "update", voicebotId)
      if (isAlreadyExistPhonenumber) {
        return errorResponse(event, 400,  "This phone number is already linked to another bot. Please use a different number.")
      }  
    }
 
    if(body?.botDetails) {
      const botDetails = body?.botDetails
            
      if(voicebotDetail?.industryId !== body?.industryId) {
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
    
        body.llmConfig = voicebotDetail?.llmConfig
        body.llmConfig.inboundPromptText = voicebotPrompts.inboundPrompt
        body.llmConfig.outboundPromptText = voicebotPrompts.outboundPrompt
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