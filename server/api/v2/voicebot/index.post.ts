import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getVoicebotDocumentById } from "~/server/utils/db/document";
import { getVoicebotByIncomingPhoneNumber } from "~/server/utils/db/voicebots";
import { zodCreateNewVoicebotSchema } from "~/server/utils/v2/db/voicebot";
import { getVoicebotPromptTextByIndustryType } from "~/server/utils/voicebot";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const body = await isValidBodyHandler(event, zodCreateNewVoicebotSchema)

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

    body.llmConfig.inboundPromptText = voicebotPrompts.inboundPrompt
    body.llmConfig.outboundPromptText = voicebotPrompts.outboundPrompt

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