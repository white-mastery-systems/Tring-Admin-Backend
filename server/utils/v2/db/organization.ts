import { count } from "drizzle-orm"

const db = useDrizzle()

export const getOrgChatAndVoicebots = async (organizationId: string) => {
  const subscription = await db
  .select({
    subscriptionId: adminSubscriptionSchema.subscriptionId,
    serviceType: adminSubscriptionSchema.serviceType,
  })
  .from(adminSubscriptionSchema)
  .where(eq(adminSubscriptionSchema.organizationId, organizationId));

  // Transform results into a lookup object
  const subs: any = subscription.reduce((acc: any, row: any) => {
    acc[row.serviceType] = row.subscriptionId;
    return acc;
  }, {});
  
  // Check logic
  let result;
  if (subs.chat && subs.voice) {
    result = "both";
  } else if (subs.chat) {
    result = "chat";
  } else if (subs.voice) {
    result = "voice";
  } else {
    result = "chat"; // fallback
  }
  
  return result;
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