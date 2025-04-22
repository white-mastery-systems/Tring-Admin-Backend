import { industriesSchema, InsertIndustries } from "~/server/schema/admin"

const db = useDrizzle()

export const createIndustry = async ({ data } : { data: InsertIndustries}) => {
  return (await db.insert(industriesSchema).values(data).returning())[0]
}

export const getAllIndustries = async ({ organizationId } : { organizationId : string }) => {
  return await db.query.industriesSchema.findMany({
    where: or(
      eq(industriesSchema.organizationId, organizationId),
      eq(industriesSchema.isDefault, true)
    ),
    columns: {
      id: true,
      industryName: true,
      isDefault: true
    }
  })
}

export const getIndustryDetail = async ({ industryId } : { industryId: string }) => {
  return await db.query.industriesSchema.findFirst({
    where: eq(industriesSchema.id, industryId)
  })
}

export const getIndustryByName = async ({ organizationId, convertedName, originalName } : { organizationId: string, convertedName: string, originalName: string }) => {
  return await db.query.industriesSchema.findFirst({
    where: 
    and(
      or(
        ilike(industriesSchema.industryName, convertedName),
        ilike(industriesSchema.industryName, originalName)
      ),
      or(
        eq(industriesSchema.isDefault, true),
        eq(industriesSchema.organizationId, organizationId)
      )
    )
  })
}