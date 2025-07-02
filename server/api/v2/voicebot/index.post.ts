import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getVoicebotByIncomingPhoneNumber } from "~/server/utils/db/voicebots";
import { voicebotKnowledgeSource, zodCreateNewVoicebotSchema } from "~/server/utils/v2/db/voicebot";
import { getVoicebotPromptTextByIndustryType } from "~/server/utils/voicebot";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const body: any = await isValidBodyHandler(event, zodCreateNewVoicebotSchema)

    const isAlreadyExistPhonenumber = await getVoicebotByIncomingPhoneNumber(body?.incomingPhoneNumber, "insert")
    if (isAlreadyExistPhonenumber) {
      return errorResponse(event, 400,  "This phone number is already linked to another bot. Please use a different number.")
    }

    body.speechToTextConfig = updateVoicebotConfig(
      defaultSpeechToTextConfig,
      body.speechToTextConfig,
    );

    body.textToSpeechConfig = updateVoicebotConfig(
      defaultTextToSpeechConfig,
      body.textToSpeechConfig,
    );

    // Organization and industry info
    const [industryDetail, orgDetails] = await Promise.all([
      getIndustryDetail({ industryId: body.industryId }),
      getOrganizationById(organizationId),
    ]);
    const industryName = industryDetail?.industryName ?? "";

    // Prepare prompts
    const { botDetails } = body;
    const role = botDetails.role === "custom" ? botDetails.otherRole : botDetails.role;
    const goal = botDetails.goal === "custom" ? botDetails.otherGoal : botDetails.goal;
 
    const voicebotPrompts = getVoicebotPromptTextByIndustryType({ 
      industryType: industryName, 
      name: botDetails?.agentName, 
      role,
      goal,
      companyName: orgDetails?.name!, 
      knowledgeBase: "",
    })

    body.llmConfig = {
      ...body?.llmConfig,
      inboundPromptText: voicebotPrompts.inboundPrompt,
      outboundPromptText: voicebotPrompts.outboundPrompt,
    };

    const voiceBot = await createVoicebot({
      organizationId,
      active: true,
      ...body,
    })
    if(voiceBot.documentId) {
      // Update the voicebotId in document table
      await updateVoicebotDocument(voiceBot.documentId!, { voicebotId: voiceBot.id })
    }
    return isValidReturnType(event, voiceBot);
  } catch (error: any) {
    logger.error(`Voicebot creation API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to create voicebot")
  }
})