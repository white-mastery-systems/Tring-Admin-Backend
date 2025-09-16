import { logger } from "~/server/logger"
import { getVoicebotUsersBySegments } from "../db/voicebot-users"

export const getUserSegments = async (organizationId: string, type: string, fromDate: Date | undefined, toDate: Date | undefined) => {
 try {
    if (type === "chat") {
      const chatbotUserSegments = await getChatbotUserBySegments(
        organizationId,
        fromDate,
        toDate
      );

      return {
        chat: {
          frequentUsers: chatbotUserSegments.frequentUsers,
          firstTimeUsers: chatbotUserSegments.firstTimeUsers,
          highValueUsers: chatbotUserSegments.highValueUsers,
          dropOffUsers: chatbotUserSegments.dropOffUsers
        },
      };
    }

    if (type === "voice") {
      const voicebotUserSegments = await getVoicebotUsersBySegments(
        organizationId,
        fromDate,
        toDate
      );

      return {
        voice: {
          frequentUsers: voicebotUserSegments.frequentUsers,
          firstTimeUsers: voicebotUserSegments.firstTimeUsers,
          dropOffUsers: voicebotUserSegments.dropOffUsers
        },
      };
    }

    if (type === "both") {
      const [chatbotUserSegments, voicebotUserSegments] = await Promise.all([
        getChatbotUserBySegments(organizationId, fromDate, toDate),
        getVoicebotUsersBySegments(organizationId, fromDate, toDate),
      ]);

      return {
        chat: {
          frequentUsers: chatbotUserSegments.frequentUsers,
          firstTimeUsers: chatbotUserSegments.firstTimeUsers,
          highValueUsers: chatbotUserSegments.highValueUsers,
        },
        voice: {
          frequentUsers: voicebotUserSegments.frequentUsers,
          firstTimeUsers: voicebotUserSegments.firstTimeUsers,
          dropOffUsers: voicebotUserSegments.dropOffUsers
        },
      };
    }
  } catch (error: any) {
    logger.error(
      `Dashboard Get User Segments Function Error: ${JSON.stringify(
        error.message
      )}`
    );
    throw new Error(error);
  }
}


