import { chatbotScheduledCallSchema, InsertChatbotScheduledCall } from "~/server/schema/bot"

const db = useDrizzle()

export const createChatbotScheduledCall = async (data: InsertChatbotScheduledCall) => {
  return (await db.insert(chatbotScheduledCallSchema).values(data).returning())[0]
}

export const getNotDialedChatScheduledCalls = async () => {
  return await db.query.chatbotScheduledCallSchema.findMany({
    where: or(
      eq(chatbotScheduledCallSchema.callStatus, "not dialed"),
      eq(chatbotScheduledCallSchema.callStatus,  "failed")
    )
  })
}

export const updateChatScheduledCall = async (id: string, data: InsertChatbotScheduledCall) => {
  return(
    await db.update(chatbotScheduledCallSchema).set({
      ...data,
      updatedAt: new Date()
      }).where(
        eq(chatbotScheduledCallSchema.id, id)
      ).returning()
  )[0]
}

export const getChatbotScheduledCallList = async (organizationId: string, phone: string, chatbotId: string) => {
  return await db.query.chatbotScheduledCallSchema.findFirst({
    where: and(
      eq(chatbotScheduledCallSchema.phone, phone),
      eq(chatbotScheduledCallSchema.chatbotId, chatbotId),
      eq(chatbotScheduledCallSchema.organizationId, organizationId),
      eq(chatbotScheduledCallSchema.callStatus, "not-dialed")
    )
  })
}