const db = useDrizzle()

export const createOrgZohoSubscription = async (subscriptionData: any) => {
  return (await db.insert(adminSubscriptionSchema).values(subscriptionData).returning())[0]
}

export const getOrgZohoSubscription = async (organizationId: string, serviceType: string) => {
  return await db.query.adminSubscriptionSchema.findFirst({
    where: and(
      eq(adminSubscriptionSchema.organizationId, organizationId),
      eq(adminSubscriptionSchema.serviceType, serviceType as 'chat' | 'voice')
    )
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

export const updateOrgZohoSubscription = async (organizationId: string, serviceType: string ,orgSubsctiption: any) => {
  return await db.update(adminSubscriptionSchema)
  .set(orgSubsctiption)
  .where( 
    and(
      eq(adminSubscriptionSchema.organizationId, organizationId), 
      eq(adminSubscriptionSchema.serviceType, serviceType as 'chat' | 'voice')
    ) 
  )
}