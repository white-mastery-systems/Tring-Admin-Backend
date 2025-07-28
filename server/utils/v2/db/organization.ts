import { count } from "drizzle-orm"

const db = useDrizzle()

export const getOrgChatAndVoicebots = async (organizationId: string) => {
  let botType: "chat" | "voice" | "both";

  const [chatbots, voicebots] = await Promise.all([
    db.select({
     count: count()
    })
    .from(chatBotSchema)
    .where(and(
      eq(chatBotSchema.organizationId, organizationId),
      eq(chatBotSchema.isDeleted, false)
    )),
    db.select({
      count: count()
    })
    .from(voicebotSchema)
    .where(and(
      eq(voicebotSchema.organizationId, organizationId),
      eq(voicebotSchema.isDeleted, false)
    ))
  ])
 
  const chatbotCount = Number(chatbots[0].count || 0);
  const voicebotCount = Number(voicebots[0].count || 0);

  if (chatbotCount > 0 && voicebotCount > 0) {
    botType = "both";
  } else if (chatbotCount > 0) {
    botType = "chat";
  } else if (voicebotCount > 0) {
    botType = "voice";
  } else {
    botType = "chat"; // default fallback
  }

  return botType;
}

export const checkBotNameExists = async (organizationId: string, botName: string, type: "chatbot" | "voicebot", id?: string) => {
  const schema = type === "chatbot" ? chatBotSchema : voicebotSchema;

  const conditions = [
    eq(schema.organizationId, organizationId),
    ilike(schema.name, botName),
    eq(schema.isDeleted, false)
  ];

  if (id) {
    conditions.push(ne(schema.id, id));
  }

  const existing = await db.select()
    .from(schema)
    .where(and(...conditions));

  return existing.length > 0;
}