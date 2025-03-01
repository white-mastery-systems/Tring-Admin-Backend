import { getWhatsappCampaignByMessageId } from "~/server/utils/db/campaign"

export default defineEventHandler(async (event) => {
  const query = await isValidQueryHandler(event, z.object({
    messageId: z.string()
  }))

  const data = await getWhatsappCampaignByMessageId(query?.messageId)

  return (data) ? data : false;
})