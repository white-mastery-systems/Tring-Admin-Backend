import { getMessages } from "~/server/utils/db/chats"

const db = useDrizzle()

export default defineEventHandler(async (event) => {
  //  await isOrganizationAdminHandler(event)

   const { id: chatId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

   // get bot user Id 
   const botUser: any  = await db.query.chatSchema.findFirst({
     where: eq(chatSchema.id, chatId)
   })

   const data = await getMessages(chatId, botUser?.botUserId)

   return data
})