const db = useDrizzle()

export const getAdminConfig = async () => {
  return await db.query.adminConfigurationSchema.findFirst({
    where: eq(adminConfigurationSchema.id, 1)
  })
}

//updateZohoBillingMetaData
export const updateAdminConfig = async (metaData: any) => {
  return await db.update(adminConfigurationSchema).set({
    metaData,
    updatedAt: new Date()
  }).where(eq(adminConfigurationSchema.id, 1))
}

