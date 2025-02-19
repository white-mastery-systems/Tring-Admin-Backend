import { InsertAdminPlanUsage } from "~/server/schema/admin"

const db = useDrizzle()

export const createSubscriptionPlanUsage = async (planUsage: InsertAdminPlanUsage) => {
  return (await db.insert(adminPlanUsageSchema).values(planUsage).returning())[0]
}