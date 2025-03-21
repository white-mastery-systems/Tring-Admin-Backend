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
      eq(adminPlanUsageSchema.subscriptionStatus, "active")
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
      eq(adminPlanUsageSchema.subscriptionStatus, "active")
    )
  ).returning())[0]
}

export const getOrgPlanUsage = async (organizationId: string, serviceType: string) => {
  return await db.query.adminPlanUsageSchema.findFirst({
    where: and(
      eq(adminPlanUsageSchema.organizationId, organizationId),  
      eq(adminPlanUsageSchema.serviceType, serviceType),
      eq(adminPlanUsageSchema.subscriptionStatus, "active")
    )
  })
}
