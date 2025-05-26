import { zohoBillingCreditSchema } from "~/server/schema/admin"

const db = useDrizzle()

export const createCustomCredit = async (data: any) => {
  return (await db.insert(zohoBillingCreditSchema).values(data).returning())[0]
}

export const getAllOrgCustomCredits = async (organizationId: string) => {
  return await db.query.zohoBillingCreditSchema.findMany({
    where: eq(zohoBillingCreditSchema.organizationId, organizationId)
  })
}

export const getOrgCustomCredits = async (creditId: string) => {
  return await db.query.zohoBillingCreditSchema.findFirst({
    where: eq(zohoBillingCreditSchema.id, creditId)
  })
}

