import { InsertAdminSubscription } from "~/server/schema/admin"

const db = useDrizzle()

export const createOrgZohoSubscription = async (subscriptionData: any) => {
  return (await db.insert(adminSubscriptionSchema).values(subscriptionData).returning())[0]
}

export const getOrgSubscriptionId = async (organizationId: string) => {
  return await db.query.adminSubscriptionSchema.findFirst({
    where: and(
      eq(adminSubscriptionSchema.organizationId, organizationId),
      isNotNull(adminSubscriptionSchema.subscriptionId),
      eq(adminSubscriptionSchema.subscriptionStatus, "active"),
    )
  })
}

export const getOrgZohoSubscription = async (organizationId: string, serviceType: string) => {
  return await db.query.adminSubscriptionSchema.findFirst({
    where: and(
      eq(adminSubscriptionSchema.organizationId, organizationId),
      eq(adminSubscriptionSchema.serviceType, serviceType as 'chat' | 'voice')
    )
  })
}

export const getSubscriptionByOrganizationId = async (organizationId: string) => {
  return await db.query.adminSubscriptionSchema.findMany({
    where: eq(adminSubscriptionSchema.organizationId, organizationId)
  })
}

export const getOrgSubscriptionBySubscriptionId = async(subscriptionId: string) => {
  return await db.query.adminSubscriptionSchema.findFirst({
    where: eq(adminSubscriptionSchema.subscriptionId, subscriptionId)
  })
}

export const isOrgZohoSubscriptionExists = async (orgId: string, serviceType: string) => {
  return await db.query.adminSubscriptionSchema.findFirst({
    where: and(
      eq(adminSubscriptionSchema.organizationId, orgId),
      eq(adminSubscriptionSchema.serviceType, serviceType)
    )
  })
}

export const updateOrgZohoSubscription = async (organizationId: string, serviceType: string ,orgSubsctiption: Partial<InsertAdminSubscription>) => {
  return await db.update(adminSubscriptionSchema)
  .set(orgSubsctiption)
  .where( 
    and(
      eq(adminSubscriptionSchema.organizationId, organizationId), 
      eq(adminSubscriptionSchema.serviceType, serviceType as 'chat' | 'voice')
    ) 
  )
}