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
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  
  let data: any = await db.query.newCampaignSchema.findMany({
    where: and(
      eq(newCampaignSchema.organizationId, organizationId),
      eq(newCampaignSchema.isDeleted, false),
      query?.q ? ilike(newCampaignSchema.campaignName, `%${query?.q}%`) : undefined,
    ),
    orderBy: [desc(newCampaignSchema.createdAt)],
  })

  const campaignIds = data.map(c => c.id);
   
  const [ voiceScheduledContactList, whatsappScheduledContactList, chatbotList, voicebotList ] = await Promise.all([
    db.query.voicebotCallScheduleSchema.findMany({
      where: inArray(voicebotCallScheduleSchema.campaignId, campaignIds),
      with: {
        bot: true
      }
    }),
    db.query.campaignWhatsappContactSchema.findMany({
      where: inArray(campaignWhatsappContactSchema.campaignId, campaignIds),
    }),
    db.query.chatBotSchema.findMany({
      where: eq(chatBotSchema.organizationId, organizationId)
    }),
    db.query.voicebotSchema.findMany({
      where: eq(voicebotSchema.organizationId, organizationId)
    })
  ])
  
  data = data.map((i: any) => {
    let recipientCount =0; let sendCount = 0; let pickupCount = 0; let successFullCount = 0
    let botName
    
    if (i.contactMethod === "voice") {
      const voicebotDetail = voicebotList.find((voicebot: any) => voicebot.id === i.botConfig.botId)
      botName = voicebotDetail?.name
      for (const contact of voiceScheduledContactList) {
        botName = contact?.bot?.name
        if(contact.campaignId === i.id) {
          recipientCount++
          if(!["Not Dialed"].includes(contact?.callStatus)){
            sendCount++
          }
          if(["Engaged", "Booked", "Follow Up", "New Lead", "Not Interested"].includes(contact?.callStatus)){
            pickupCount++
          }
          if(["Booked", "Follow Up"].includes(contact?.callStatus)){
            successFullCount++
          }
        }
      }
    } 
   
    if (i.contactMethod === "whatsapp") {
      const chatbotDetail = chatbotList.find((chatbot: any) => chatbot.id === i.botConfig.botId)
      botName = chatbotDetail?.name
      for (const contact of whatsappScheduledContactList) {
        if(contact.campaignId === i.id) {
          recipientCount++
          sendCount++
          if(["Engaged", "Booked", "Follow Up", "New Lead", "Not Interested"].includes(contact?.interactionStatus)){
            pickupCount++
          }
          if(["Booked", "Follow Up"].includes(contact?.interactionStatus)){
            successFullCount++
          }
        }
      }
    }
    
     return {
       ...i,
       botName,
       recipientCount,
       sendCount,
       pickupCount,
       successFullCount,
       createdAt: momentTz(i?.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    };
  })
  
  if (query?.page && query?.limit) {
    const paginatedCampaigns = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedCampaigns,
    };
  } else {
    return data;
  }
}

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

export const getOrgCampaignsWithMetrics = async (organizationId: string) => {
  const interactionStatuses = new Set(["Engaged", "booked", "follow-up", "New Lead"]);
  const conversionStatuses = new Set(["booked", "follow-up"]);

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
      eq(newCampaignSchema.isDeleted, false)
    ));

    const campaignIds = campaigns.map(c => c.id);

  // Fetch all contact records from both sources
  const [whatsappContacts, voiceContacts] = await Promise.all([
    db
      .select({
        campaignId: campaignWhatsappContactSchema.campaignId,
        interactionStatus: campaignWhatsappContactSchema.interactionStatus,
      })
      .from(campaignWhatsappContactSchema)
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

  // Build a campaign lookup map
  const contactMap = new Map<string, { interactions: number; conversions: number }>();

  for (const { campaignId, interactionStatus } of allContacts) {
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

    return {
      ...item,
      interactionCount: stats.interactions,
      conversionCount: stats.conversions,
    };
  });
};
