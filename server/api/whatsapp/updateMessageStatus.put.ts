import { updateWhatsappMessageStatusByMessageId } from "~/server/utils/db/campaign"

const zodUpdateWhatsappMessageBody = z.object({
  messageId: z.string(),
  chatId: z.string(),
  messageStatus: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, zodUpdateWhatsappMessageBody)

  const data = await updateWhatsappMessageStatusByMessageId(body.messageId, body )

  return data
})