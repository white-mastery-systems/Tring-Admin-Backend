import { count } from "drizzle-orm"

const db = useDrizzle()

export const getOrgChatAndVoicebots = async (organizationId: string) => {
  const subscription = await db
    .select({
      subscriptionId: adminSubscriptionSchema.subscriptionId,
      subscriptionStatus: adminSubscriptionSchema.subscriptionStatus,
      serviceType: adminSubscriptionSchema.serviceType,
    })
    .from(adminSubscriptionSchema)
    .where(eq(adminSubscriptionSchema.organizationId, organizationId));

  // Transform results into a lookup object
  const subs: any = subscription.reduce((acc: any, row: any) => {
    acc[row.serviceType] = {
      id: row.subscriptionId,
      status: row.subscriptionStatus,
    };
    return acc;
  }, {});

  // Check logic
  let result;
  if ((subs.chat?.id && subs.voice?.id) ||
      (subs.chat?.id && subs.voice?.status === "trial") ||
      (subs.voice?.id && subs.chat?.status === "trial")) {
    result = "both";
  } else if (subs.chat?.id) {
    result = "chat";
  } else if (subs.voice?.id) {
    result = "voice";
  } else {
    result = "chat"; // fallback
  }

  return result;
};


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