import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { getChatbotImprovementDetailsByOrgId, getChatImprovementsByOrgId, getChatImprovementWeeklyHealthScore } from "~/server/utils/db/chats"
import { getVoicebotImprovementDetailsByOrgId, getVoiceImprovementsByOrgId, getVoiceImprovementWeeklyHealthScore } from "~/server/utils/v2/db/voicebot"

export default defineEventHandler(async (event) => {
  try {
    const tzHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(tzHeader) ? tzHeader[0] : tzHeader || "Asia/Kolkata";

    const organizationId = await isOrganizationAdminHandler(event);

    const query = await isValidQueryHandler(event, z.object({
      limit: z.string().optional()
    }))

    const rawBotType: string = await getOrgChatAndVoicebots(organizationId);

    const shouldFetchChat = rawBotType === "chat" || rawBotType === "both";
    const shouldFetchVoice = rawBotType === "voice" || rawBotType === "both";

    let chatDetails: any[] = [];
    let voiceDetails: any[] = [];

    let chatResult: any = { totalImprovements: {}, highPriority: {}, healthScore: {} };
    let voiceResult: any = { totalImprovements: {}, highPriority: {}, healthScore: {} };

    const tasks: Promise<void>[] = [];

    if (shouldFetchChat) {
      tasks.push(
        (async () => {
          const [impr, improvementDetails] = await Promise.all([
            getChatImprovementsByOrgId(organizationId),
            getChatbotImprovementDetailsByOrgId(organizationId, query?.limit)
          ]);
          chatDetails = improvementDetails;
          chatResult = impr;
        })()
      );
    }

    if (shouldFetchVoice) {
      tasks.push(
        (async () => {
          const [impr, improvementDetails] = await Promise.all([
            getVoiceImprovementsByOrgId(organizationId),
            getVoicebotImprovementDetailsByOrgId(organizationId, query?.limit)
          ]);
          voiceDetails = improvementDetails;
          voiceResult = impr;
        })()
      );
    }

    await Promise.all(tasks);

    const result = {
      chatTotalImprovements: String(chatResult?.totalImprovements.count || 0),
      chatHighPriorityImprovements: String(chatResult?.highPriority.count || 0),
      chatHealthScore: chatResult?.healthScore.score || "0%",

      voiceTotalImprovements: String(voiceResult?.totalImprovements.count || 0),
      voiceHighPriorityImprovements: String(voiceResult?.highPriority.count || 0),
      voiceHealthScore: voiceResult?.healthScore.score || "0%",

      totalImprovementsImpactUsers:
        (chatResult?.totalImprovements.potentialImpact || 0) +
        (voiceResult?.totalImprovements.potentialImpact || 0),

      highPriorityImprovementsImpactUsers:
        (chatResult?.highPriority.potentialImpact || 0) +
        (voiceResult?.highPriority.potentialImpact || 0),

      healthScoreImpactUsers:
        (chatResult?.healthScore.potentialImpact || 0) +
        (voiceResult?.healthScore.potentialImpact || 0)
    };

    const improvementList = [
      ...voiceDetails.map(i => ({ ...i, channel: "voice", module: "improvement" })),
      ...chatDetails.map(i => ({ ...i, channel: "chat", module: "improvement" })),
    ].sort((a, b) => b.instanceCount - a.instanceCount);

    return { result, improvementList };
  } catch (error: any) {
    logger.error(`Dashboard Get Improvement API Error: ${JSON.stringify(error.message)}`);
    return errorResponse(event, 500, "Unable to fetch dashboard improvements");
  }
});


// export default defineEventHandler(async (event) => {
//   try {
//     const tzHeader = event.node?.req?.headers["time-zone"];
//     const timeZone = Array.isArray(tzHeader) ? tzHeader[0] : tzHeader || "Asia/Kolkata";

//     const organizationId = await isOrganizationAdminHandler(event);
 
//     const query = await isValidQueryHandler(event, z.object({
//       limit: z.string().optional()
//     }))

//     const rawBotType: string = await getOrgChatAndVoicebots(organizationId);

//     const shouldFetchChat = rawBotType === "chat" || rawBotType === "both"
//     const shouldFetchVoice = rawBotType === "voice" || rawBotType === "both" 

//     const result: any = {}

//     const tasks: Promise<void>[] = [];

//     let chatDetails: any[] = [];
//     let voiceDetails: any[] = [];

//     if (shouldFetchChat) {
//       tasks.push(
//         (async () => {
//           const [impr, improvementDetails] = await Promise.all([
//             getChatImprovementsByOrgId(organizationId),
//             // getChatImprovementWeeklyHealthScore(organizationId, timeZone),
//             getChatbotImprovementDetailsByOrgId(organizationId, query?.limit)
//           ]);
//           chatDetails = improvementDetails;
//           result.chat = {
//             totalImprovements: impr.totalImprovements.count,
//             totalImprovementImpactUsers: impr.totalImprovements.potentialImpact,
//             highPriorityImprovements: impr.highPriority.count,
//             highPriorityImpactUsers: impr.highPriority.potentialImpact,
//             healthScore: impr.healthScore.score,
//             healthscoreImpactUsers: impr.healthScore.potentialImpact
//             // improvementHealthScoreGrowth: growth
//           };
//         })()
//       );
//     }

//     if (shouldFetchVoice) {
//       tasks.push(
//         (async () => {
//           const [impr, improvementDetails] = await Promise.all([
//             getVoiceImprovementsByOrgId(organizationId),
//             // getVoiceImprovementWeeklyHealthScore(organizationId, timeZone),
//             getVoicebotImprovementDetailsByOrgId(organizationId, query?.limit)
//           ]);
//           voiceDetails = improvementDetails;
//           result.voice = {
//             totalImprovements: impr.totalImprovements.count,
//             totalImprovementImpactUsers: impr.totalImprovements.potentialImpact,
//             highPriorityImprovements: impr.highPriority.count,
//             highPriorityImpactUsers: impr.highPriority.potentialImpact,
//             healthScore: impr.healthScore.score,
//             healthscoreImpactUsers: impr.healthScore.potentialImpact
//             // improvementHealthScoreGrowth: growth
//           };
//         })()
//       );
//     }

//     await Promise.all(tasks);

//        // Merge and SUM chat + voice potentialImpact
//     const result = {
//       healthScore: {
//         scoreChat: chatResult?.healthScore.score || "0%",
//         scoreVoice: voiceResult?.healthScore.score || "0%",
//         potentialImpact:
//           (chatResult?.healthScore.potentialImpact || 0) +
//           (voiceResult?.healthScore.potentialImpact || 0),
//       },
//       highPriority: {
//         countChat: chatResult?.highPriority.count || 0,
//         countVoice: voiceResult?.highPriority.count || 0,
//         potentialImpact:
//           (chatResult?.highPriority.potentialImpact || 0) +
//           (voiceResult?.highPriority.potentialImpact || 0),
//       },
//       totalImprovements: {
//         countChat: chatResult?.totalImprovements.count || 0,
//         countVoice: voiceResult?.totalImprovements.count || 0,
//         potentialImpact:
//           (chatResult?.totalImprovements.potentialImpact || 0) +
//           (voiceResult?.totalImprovements.potentialImpact || 0),
//       }
//     };

//     const improvementList = [
//       ...voiceDetails.map(i => ({ ...i, channel: "voice", module: "improvement" })),
//       ...chatDetails.map(i => ({ ...i, channel: "chat", module: "improvement" })), 
//     ].sort((a,b) => b.instanceCount - a.instanceCount)

//     return { result, improvementList };
//   } catch (error: any) {
//     logger.error(`Dashboard Get Improvement API Error: ${JSON.stringify(error.message)}`);
//     return errorResponse(event, 500, "Unable to fetch dashboard improvements");
//   }
// })