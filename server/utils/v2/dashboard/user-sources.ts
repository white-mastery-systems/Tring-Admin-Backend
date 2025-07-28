import { logger } from "~/server/logger"
import { getChatSessionsByChannels } from "../db/chats"
import { getVoiceCallAndLeads } from "../db/call-logs"

export const getEnagementAndLeadMetricsBySource = async (organizationId: string) => {
  try {
    const chatEnagement = await getChatSessionsByChannels(organizationId)
    const voiceEnagement = await getVoiceCallAndLeads(organizationId)

    // Merge chatEnagement and voiceEnagement arrays into a single array
    return [...chatEnagement, ...voiceEnagement]
  } catch (error: any) {
    logger.error(`Error in getEnagementAndLeadMetricsBySource: ${JSON.stringify(error.message)}`)
    throw new Error("Unable to get engagement and lead metrics by source")
  }
}