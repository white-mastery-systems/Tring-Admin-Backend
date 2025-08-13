import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getChatbotImprovementDetailsByOrgId, getChatImprovementsByOrgId, getChatImprovementWeeklyHealthScore } from "~/server/utils/db/chats"
import { getVoicebotImprovementDetailsByOrgId, getVoiceImprovementsByOrgId, getVoiceImprovementWeeklyHealthScore } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    const tzHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(tzHeader) ? tzHeader[0] : tzHeader || "Asia/Kolkata";

    const organizationId = await isOrganizationAdminHandler(event);
    const rawBotType: string = await getOrgChatAndVoicebots(organizationId);

    const shouldFetchChat = rawBotType === "chat" || rawBotType === "both"
    const shouldFetchVoice = rawBotType === "voice" || rawBotType === "both" 

    const result: any = {}

    const tasks: Promise<void>[] = [];

    let chatDetails: any[] = [];
    let voiceDetails: any[] = [];

    if (shouldFetchChat) {
      tasks.push(
        (async () => {
          const [impr, improvementDetails] = await Promise.all([
            getChatImprovementsByOrgId(organizationId),
            // getChatImprovementWeeklyHealthScore(organizationId, timeZone),
            getChatbotImprovementDetailsByOrgId(organizationId)
          ]);
          chatDetails = improvementDetails;
          result.chat = {
            totalImprovements: impr.totalImprovements,
            highPriorityImprovements: impr.highPriorityImprovements,
            healthScore: impr.healthScore,
            // improvementHealthScoreGrowth: growth
          };
        })()
      );
    }

    if (shouldFetchVoice) {
      tasks.push(
        (async () => {
          const [impr, improvementDetails] = await Promise.all([
            getVoiceImprovementsByOrgId(organizationId),
            // getVoiceImprovementWeeklyHealthScore(organizationId, timeZone),
            getVoicebotImprovementDetailsByOrgId(organizationId)
          ]);
          voiceDetails = improvementDetails;
          result.voice = {
            totalImprovements: impr.totalImprovements,
            highPriorityImprovements: impr.highPriorityImprovements,
            healthScore: impr.healthScore,
            // improvementHealthScoreGrowth: growth
          };
        })()
      );
    }

    await Promise.all(tasks);

    const improvementList = [
      ...chatDetails.map(i => ({ ...i, channel: "chat", module: "improvement" })), 
      ...voiceDetails.map(i => ({ ...i, channel: "voice", module: "improvement" })),
    ];

    return { result, improvementList };
  } catch (error: any) {
    logger.error(`Dashboard Get Improvement API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to fetch dashboard improvements");
  }
})