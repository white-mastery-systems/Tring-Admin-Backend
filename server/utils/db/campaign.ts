import { campaignSchema, InsertCampaign } from "~/server/schema/admin"

const db = useDrizzle()

export const createCampaign = async (campaign: InsertCampaign) => {
  return (
    await db.insert(campaignSchema)
    .values(campaign)
    .returning()
  )[0]
}

export const campaignList = async (organizationId: string) => {
  const data = await db.query.campaignSchema.findMany({
    where: eq(campaignSchema.organizationId, organizationId)
  })
  return data
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