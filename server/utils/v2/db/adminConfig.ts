const db = useDrizzle();

export const updateZohoBillingMetaData = async (metaData: any) => {
  await db
    .update(adminConfigurationSchema)
    .set({ metaData: metaData })
    .where(eq(adminConfigurationSchema.id, 1));
};

export const getZohoBillingMetaData = async () => {
  return await db.query.adminConfigurationSchema.findFirst({
    where: eq(adminConfigurationSchema.id, 1),
  });
};
