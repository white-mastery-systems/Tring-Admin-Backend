import { InsertNewCampaign } from "~/server/schema/admin"
import momentTz from "moment-timezone"
import { inArray } from "drizzle-orm"

const db = useDrizzle()

export const createNewCampaign = async (data: InsertNewCampaign) => {
  return (await db.insert(newCampaignSchema).values(data).returning())[0]
}

export const getNewCampaignByName = async (organizationId: string, campaignName: string, mode: string, campaignId?: string) => {
  return await db.query.newCampaignSchema.findFirst({
    where: and(
      eq(newCampaignSchema.organizationId, organizationId),
      eq(newCampaignSchema.campaignName, campaignName),
      eq(newCampaignSchema.isDeleted, false),
      (mode === "update") ? ne(newCampaignSchema.id, campaignId) : undefined
    )
  })
}

export const getNewCampaignList = async (organizationId: string, query: any, timeZone: string) => {
  let page = 1, offset = 0, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }

  // 🟢 Fetch campaigns
  const campaigns = await db.query.newCampaignSchema.findMany({
    where: and(
      eq(newCampaignSchema.organizationId, organizationId),
      eq(newCampaignSchema.isDeleted, false),
      query?.q ? ilike(newCampaignSchema.campaignName, `%${query?.q}%`) : undefined,
    ),
    orderBy: [desc(newCampaignSchema.createdAt)],
  });

  if (!campaigns.length) {
    return {
      page,
      limit,
      totalPageCount: 0,
      totalCount: 0,
      data: [],
    };
  }

  const campaignIds = campaigns.map(c => c.id);

  // 🟢 Parallel fetch with aggregations
  const [
    voiceContactStats,
    whatsappContactStats,
    chatbotList,
    voicebotList,
  ] = await Promise.all([
    // Aggregate voice contacts
    db
      .select({
        campaignId: voicebotCallScheduleSchema.campaignId,
        callStatus: voicebotCallScheduleSchema.callStatus,
        count: sql<number>`COUNT(*)`,
      })
      .from(voicebotCallScheduleSchema)
      .where(inArray(voicebotCallScheduleSchema.campaignId, campaignIds))
      .groupBy(voicebotCallScheduleSchema.campaignId, voicebotCallScheduleSchema.callStatus),

    // Aggregate whatsapp contacts (join with chat to get chatOutcome)
    db
      .select({
        campaignId: campaignWhatsappContactSchema.campaignId,
        chatOutcome: chatSchema.chatOutcome,
        count: sql<number>`COUNT(*)`,
      })
      .from(campaignWhatsappContactSchema)
      .leftJoin(chatSchema, eq(chatSchema.id, campaignWhatsappContactSchema.chatId))
      .where(inArray(campaignWhatsappContactSchema.campaignId, campaignIds))
      .groupBy(campaignWhatsappContactSchema.campaignId, chatSchema.chatOutcome),

    // Bots
    db.query.chatBotSchema.findMany({
      where: eq(chatBotSchema.organizationId, organizationId),
    }),
    db.query.voicebotSchema.findMany({
      where: eq(voicebotSchema.organizationId, organizationId),
    }),
  ]);

  // 🟢 Index bots for quick lookup
  const chatbotMap = new Map(chatbotList.map(bot => [bot.id, bot]));
  const voicebotMap = new Map(voicebotList.map(bot => [bot.id, bot]));

  // 🟢 Index stats for quick lookup
  const voiceStatsMap = new Map<string, { [status: string]: number }>();
  for (const row of voiceContactStats) {
    if (!voiceStatsMap.has(row.campaignId)) voiceStatsMap.set(row.campaignId, {});
    voiceStatsMap.get(row.campaignId)![row.callStatus] = Number(row.count);
  }

  const whatsappStatsMap = new Map<string, { [outcome: string]: number }>();
  for (const row of whatsappContactStats) {
    if (!whatsappStatsMap.has(row.campaignId)) whatsappStatsMap.set(row.campaignId, {});
    whatsappStatsMap.get(row.campaignId)![row.chatOutcome || "Unknown"] = Number(row.count);
  }

  // 🟢 Final mapping
  const data = campaigns.map((c) => {
    let recipientCount = 0,
      sendCount = 0,
      pickupCount = 0,
      successFullCount = 0,
      botName: string | undefined;

    if (c.contactMethod === "voice") {
      const stats = voiceStatsMap.get(c.id) || {};
      const bot = voicebotMap.get(c.botConfig.botId);
      botName = bot?.name;

      for (const [status, count] of Object.entries(stats)) {
        recipientCount += count;
        if (status !== "Not Dialed") sendCount += count;
        if (["Engaged", "Booked", "Follow Up", "New Lead"].includes(status)) pickupCount += count;
        if (["Booked", "Follow Up"].includes(status)) successFullCount += count;
      }
    }

    if (c.contactMethod === "whatsapp") {
      const stats = whatsappStatsMap.get(c.id) || {};
      const bot = chatbotMap.get(c.botConfig.botId);
      botName = bot?.name;

      for (const [outcome, count] of Object.entries(stats)) {
        recipientCount += count;
        sendCount += count; // all scheduled are "sent"
        if (["Engaged", "Booked", "Follow Up", "New Lead"].includes(outcome)) pickupCount += count;
        if (["Booked", "Follow Up"].includes(outcome)) successFullCount += count;
      }
    }

    return {
      ...c,
      botName,
      recipientCount,
      sendCount,
      pickupCount,
      successFullCount,
      createdAt: momentTz(c?.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    };
  });

  // 🟢 Pagination
  if (query?.page && query?.limit) {
    const paginated = data.slice(offset, offset + limit);
    return {
      page,
      limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginated,
    };
  }

  return data;
};


export const getNewCampaignById = async (campaignId: string) => {
  return await db.query.newCampaignSchema.findFirst({
    where: and(
      eq(newCampaignSchema.id, campaignId),
      eq(newCampaignSchema.isDeleted, false)
    )
  })
}

export const updateNewCampaignById = async (campaignId: string, data: Partial<InsertNewCampaign>) => {
  return (
    await db.update(newCampaignSchema).set({
      ...data,
      updatedAt: new Date()
    }).where(
      eq(newCampaignSchema.id, campaignId)
    ).returning()
  )[0]
}

export const deleteNewCampaignById = async (campaignId: string) => {
  return (
    await db.delete(newCampaignSchema).where(
      eq(newCampaignSchema.id, campaignId)
    ).returning()
  )[0]
}

export const getAllVoiceNewCampaigns = async () => {
  return await db.query.newCampaignSchema.findMany({
    where: and(
      eq(newCampaignSchema.contactMethod, "voice"),
      eq(newCampaignSchema.isDeleted, false)
    )
  })
}

export const getVoiceCampaignByContactGroupId = async(bucketId: string) => {
  return await db.query.newCampaignSchema.findMany({
    where: and(
      sql`${bucketId} = ANY(${newCampaignSchema.bucketIds})`,
      eq(newCampaignSchema.contactMethod, "voice"),
      eq(newCampaignSchema.isDeleted, false)
    )
  });
}

export const getOrgCampaignsWithMetrics = async (organizationId: string, fromDate: Date | undefined, toDate: Date  | undefined) => {
  const interactionStatuses = new Set(["Engaged", "Booked", "Follow Up", "New Lead"]);
  const conversionStatuses = new Set(["Booked", "Follow Up"]);

  // Fetch all campaigns
  const campaigns = await db
    .select({
      id: newCampaignSchema.id,
      name: newCampaignSchema.campaignName,
      type: newCampaignSchema.contactMethod,
      isDeleted: newCampaignSchema.isDeleted
    })
    .from(newCampaignSchema)
    .where(and(
      eq(newCampaignSchema.organizationId, organizationId),
      eq(newCampaignSchema.isDeleted, false),
      ...(fromDate && toDate ? [
          gte(newCampaignSchema.createdAt, fromDate),
          lte(newCampaignSchema.createdAt, toDate),
        ] : []),
    ));

  const campaignIds = campaigns.map(c => c.id);

  // Fetch all contact records from both sources
  const [whatsappContacts, voiceContacts] = await Promise.all([
    db
      .select({
        campaignId: campaignWhatsappContactSchema.campaignId,
        interactionStatus: chatSchema.chatOutcome || campaignWhatsappContactSchema.messageStatus
      })
      .from(campaignWhatsappContactSchema)
      .leftJoin(
        chatSchema,
        eq(campaignWhatsappContactSchema.chatId, chatSchema.id) // adjust key if different
      )
      .where(
        inArray(campaignWhatsappContactSchema.campaignId, campaignIds)
      ),
    db
      .select({
        campaignId: voicebotCallScheduleSchema.campaignId,
        interactionStatus: voicebotCallScheduleSchema.callStatus
      })
      .from(voicebotCallScheduleSchema)
      .where(
        inArray(voicebotCallScheduleSchema.campaignId, campaignIds)
      )
  ]);

  // Merge contacts
  const allContacts = [...whatsappContacts, ...voiceContacts];

  // return allContacts

  // Build a campaign lookup map
  const contactMap = new Map<string, { interactions: number; conversions: number }>();

  for (let { campaignId, interactionStatus } of allContacts) {
    if (!campaignId) continue;

    const existing = contactMap.get(campaignId) ?? { interactions: 0, conversions: 0 };

    if (interactionStatuses.has(interactionStatus)) {
      existing.interactions += 1;
    }
    if (conversionStatuses.has(interactionStatus)) {
      existing.conversions += 1;
    }

    contactMap.set(campaignId, existing);
  }

  // Combine campaign and contact stats
  return campaigns.map((item) => {
    const stats = contactMap.get(item.id) ?? { interactions: 0, conversions: 0 };

    let conversionRate = "0%";
    if (stats.interactions > 0) {
      const rate = ((stats.conversions / stats.interactions) * 100).toFixed(1);
      const formattedRate = rate.endsWith(".0") ? rate.slice(0, -2) : rate;
      conversionRate = `${formattedRate}%`;
    }

    return {
      ...item,
      interactionCount: stats.interactions,
      conversionCount: stats.conversions,
      conversionRate
    };
  }).sort((a, b) => b.interactionCount - a.interactionCount);
};
