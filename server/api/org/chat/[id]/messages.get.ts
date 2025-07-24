import { getMessages } from "~/server/utils/db/chats"

const db = useDrizzle()

export default defineEventHandler(async (event) => {
   //  await isOrganizationAdminHandler(event)
   const timeZoneHeader = event.node?.req?.headers["time-zone"];
   const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";

   const { id: chatId } = await isValidRouteParamHandler(event, checkPayloadId("id"))

   const query = await isValidQueryHandler(event, z.object({
    siteVisit: z.string().optional()
   }))

   // get bot user Id 
   const botUser: any  = await db.query.chatSchema.findFirst({
     where: eq(chatSchema.id, chatId)
   })

   const data = await getMessages(chatId, botUser?.botUserId, query, timeZone)

  // Previously, the code was returning the entire data object. Now it fetches all messages from all or multiple chats.
  return [{
    messages: data.flatMap((item: any) => {
      const messages = item.messages || [];
      return (messages[0]?.role === "user" && messages[0].content === "Hi") ? messages.slice(1) : messages;
    })
  }];
})