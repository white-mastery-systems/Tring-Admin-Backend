import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { zodUpdateNewVoicebotSchema } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;
    const { id: voicebotId } = await isValidRouteParamHandler(event, checkPayloadId("id"));
    
    const body: any = await isValidBodyHandler(event, zodUpdateNewVoicebotSchema);

    const voicebotDetail = await getVoicebotById(voicebotId);
    
    // Check phone number conflict
    if (body?.incomingPhoneNumber) {
      const conflict = await getVoicebotByIncomingPhoneNumber(body.incomingPhoneNumber, "update", voicebotId);
      if (conflict) {
        return errorResponse(event, 400, "This phone number is already linked to another bot. Please use a different number.");
      }
    }

    // Commented out for now, can be uncommented later if needed
    // // Handle Bot Prompt Generation
    // if (body?.botDetails) {
    //   const { botDetails } = body;
    //   const orgDetails = await getOrganizationById(organizationId);

    //   // Update industry if changed

    //   if (voicebotDetail?.botDetails.agentName !== botDetails?.agentName) {
    //     // let industryName = botDetails?.industryType;
    //     // if(voicebotDetail?.industryId !== body?.industryId) {
    //     //   const industryDetail = await getIndustryDetail({
    //     //     industryId: body?.industryId ?? voicebotDetail?.industryId,
    //     //   });
    //     //   industryName = industryDetail?.industryName ?? industryName;
    //     // }
        
    //     const role = botDetails.role === "custom" ? botDetails.otherRole : botDetails.role;
    //     const goal = botDetails.goal === "custom" ? botDetails.otherGoal : botDetails.goal;

    //     const prompts = getVoicebotPromptTextByIndustryType({
    //       industryType: voicebotDetail?.botDetails?.industryName,
    //       name: botDetails.agentName,
    //       role,
    //       goal,
    //       companyName: orgDetails?.name ?? "",
    //       knowledgeBase: ""
    //     });

    //     body.llmConfig = {
    //       ...voicebotDetail?.llmConfig,
    //       inboundPromptText: prompts.inboundPrompt,
    //       outboundPromptText: prompts.outboundPrompt,
    //     };
    //   }
    // }

    // Clear fields if knowledge source changed
    if (body?.knowledgeSource && body.knowledgeSource !== voicebotDetail?.knowledgeSource) {
      const resetMap: Record<string, (keyof typeof body)[]> = {
        website: ["textContent"],
        text: ["websiteLink", "websiteContent"],
        document: ["textContent", "websiteLink", "websiteContent"],
      };
      const resetFields = resetMap[body.knowledgeSource] ?? [];
      for (const field of resetFields) {
        body[field] = null;
      }
    }

    // Merge configs with defaults
    if (body?.speechToTextConfig) {
      body.speechToTextConfig = updateVoicebotConfig(defaultSpeechToTextConfig, body.speechToTextConfig);
    }

    if (body?.textToSpeechConfig) {
      body.textToSpeechConfig = updateVoicebotConfig(defaultTextToSpeechConfig, body.textToSpeechConfig);
    }

    if (body?.llmConfig) {
      body.llmConfig = {
        ...voicebotDetail?.llmConfig,
        ...body.llmConfig,
      };
    }

    // Disable if IVR removed
    if (body?.ivrConfig === null) {
      body.active = false;
    }

    const updated = await updateVoiceBot(voicebotId, body);
    return isValidReturnType(event, updated);
  } catch (error: any) {
    logger.error(`Voicebot update API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to update the voicebot");
  }
})