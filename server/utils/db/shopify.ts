const db = useDrizzle();

export const getShopifyIntegrationDetails = async (integrationId: string) => {
  const data = await db.query.integrationSchema.findFirst({
    where: eq(integrationSchema.id, integrationId),
  });
  return data?.metadata;
};
