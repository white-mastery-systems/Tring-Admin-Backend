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
    where: eq(newCampaignSchema.organizationId, organizationId),
    orderBy: [desc(newCampaignSchema.createdAt)],
  })
   
  const [ voiceScheduledContactList, whatsappScheduledContactList ] = await Promise.all([
    db.query.voicebotCallScheduleSchema.findMany({
      where: eq(voicebotCallScheduleSchema.organizationId, organizationId)
    }),
    db.query.campaignWhatsappContactSchema.findMany({
      where: eq(campaignWhatsappContactSchema.organizationId, organizationId)
    }),
  ])
  
  data = data.map((i: any) => {
    let totalCount = 0 ; let interactionCount = 0;

    let voiceTotalCount = 0; let voiceInteractedCount = 0; let whatsappTotalCount = 0; let whatsappInteractedCount = 0;
   
    if(i.contactMethod === "voice") {
      for (const contact of voiceScheduledContactList) {
        if(contact.campaignId === i.id) {
          voiceTotalCount++
          if(!["Not Dialed", "Failed", "No Response", "Invalid Number"].includes(contact?.callStatus)){
            voiceInteractedCount++
          }
        }
      }
      totalCount = voiceTotalCount
      interactionCount = voiceInteractedCount
    } else {
      for (const contact of whatsappScheduledContactList) {
        if(contact.campaignId === i.id) {
          whatsappTotalCount++
          if(!["Failed", "No Response", "Invalid Number"].includes(contact?.interactionStatus)){
            whatsappInteractedCount++
          }
        }
      }
      totalCount = whatsappTotalCount
      interactionCount = whatsappInteractedCount
    }

     return {
       ...i,
       totalCount,
       interactionCount,
       createdAt: momentTz(i?.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
    };
  })
  
  return data
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