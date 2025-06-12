import { InsertNewCampaign } from "~/server/schema/admin"
import momentTz from "moment-timezone"

const db = useDrizzle()

export const createNewCampaign = async (data: InsertNewCampaign) => {
  return (await db.insert(newCampaignSchema).values(data).returning())[0]
}

export const getNewCampaignByName = async (organizationId: string, campaignName: string, mode: string, campaignId?: string) => {
  return await db.query.newCampaignSchema.findFirst({
    where: and(
      eq(newCampaignSchema.organizationId, organizationId),
      eq(newCampaignSchema.campaignName, campaignName),
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
      query?.q ? ilike(newCampaignSchema.campaignName, `%${query?.q}%`) : undefined,
    ),
    orderBy: [desc(newCampaignSchema.createdAt)],
  })
   
  const [ voiceScheduledContactList, whatsappScheduledContactList, chatbotList ] = await Promise.all([
    db.query.voicebotCallScheduleSchema.findMany({
      where: eq(voicebotCallScheduleSchema.organizationId, organizationId),
      with: {
        bot: true
      }
    }),
    db.query.campaignWhatsappContactSchema.findMany({
      where: eq(campaignWhatsappContactSchema.organizationId, organizationId)
    }),
    db.query.chatBotSchema.findMany({
      where: eq(chatBotSchema.organizationId, organizationId)
    })
  ])
  
  data = data.map((i: any) => {
    let recipientCount =0; let sendCount = 0; let pickupCount = 0; let successFullCount = 0
    let botName
    if (i.contactMethod === "voice") {
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
    where: eq(newCampaignSchema.id, campaignId)
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
    where: eq(newCampaignSchema.contactMethod, "voice")
  })
}