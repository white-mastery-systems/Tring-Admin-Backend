import { campaignSchema, InsertCampaign } from "~/server/schema/admin"

const db = useDrizzle()

export const createCampaign = async (campaign: InsertCampaign) => {
  return (
    await db.insert(campaignSchema)
    .values(campaign)
    .returning()
  )[0]
}

export const campaignList = async (organizationId: string, query: any) => {
   let page, offset, limit = 0
    
  if(query.page && query.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }
  const data = await db.query.campaignSchema.findMany({
    where: eq(campaignSchema.organizationId, organizationId)
  })
  if(query?.page && query?.limit) {
    const paginatedCampaign = data.slice(offset, offset + limit); 
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length/ limit) || 1,
      totalCount: data.length,
      data: paginatedCampaign
    }
  } else {
      return data
  }
}

export const getCampaignById = async (campaignId: string) => {
  const data = await db.query.campaignSchema.findFirst({
    where: eq(campaignSchema.id, campaignId)
  })
  return data
}

export const updateCampaign = async (campaignId: string, campaign: InsertCampaign) => {
  return (
    await db.update(campaignSchema)
    .set({
      ...campaign,
      updatedAt: new Date()
    })
    .where(eq(campaignSchema.id, campaignId))
    .returning()
  )[0]
}

export const deleteCampaign = async (campaignId: string) => {
  return (
    await db.delete(campaignSchema)
    .where(eq(campaignSchema.id, campaignId))
    .returning()
  )[0]
}