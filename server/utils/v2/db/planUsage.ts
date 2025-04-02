import { inArray } from "drizzle-orm"
import { InsertAdminPlanUsage } from "~/server/schema/admin"

const db = useDrizzle()

export const createSubscriptionPlanUsage = async (planUsage: InsertAdminPlanUsage) => {
  return (await db.insert(adminPlanUsageSchema).values(planUsage).returning())[0]
}

export const updateSubscriptionPlanUsageByOrgId = async (orgId: string, serviceType: string , planUsage: Partial<InsertAdminPlanUsage>) => {
  return( await db.update(adminPlanUsageSchema).set({
    ...planUsage,
    updatedAt: new Date()
  }).where(
    and(
      eq(adminPlanUsageSchema.organizationId, orgId),
      eq(adminPlanUsageSchema.serviceType, serviceType),
      inArray(adminPlanUsageSchema.subscriptionStatus, ["active", "trial"])
    )
  ).returning())[0]
}

export const updateSubscriptionPlanUsageById= async (id: string, planUsage: Partial<InsertAdminPlanUsage>) => {
  return( await db.update(adminPlanUsageSchema).set({
    ...planUsage,
    updatedAt: new Date()
  }).where(
    and(
      eq(adminPlanUsageSchema.id, id),
      inArray(adminPlanUsageSchema.subscriptionStatus, ["active", "trial"])
    )
  ).returning())[0]
}

export const getOrgPlanUsage = async (organizationId: string, serviceType: string) => {
  return await db.query.adminPlanUsageSchema.findFirst({
    where: and(
      eq(adminPlanUsageSchema.organizationId, organizationId),  
      eq(adminPlanUsageSchema.serviceType, serviceType),
      inArray(adminPlanUsageSchema.subscriptionStatus, ["active", "trial"])
    )
  })
}

export const getOrgPlanUsageByOrgId = async (organizationId: string) => {
  return await db.query.adminPlanUsageSchema.findMany({
    where: and(
      eq(adminPlanUsageSchema.organizationId, organizationId),
      inArray(adminPlanUsageSchema.subscriptionStatus, ["active", "trial"])
    )
  })
}