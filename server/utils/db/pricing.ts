const db = useDrizzle();

export const getPricingInformation = async (plan: string) => {
  const data = await db.query.adminPricingSchema.findFirst({
    where: eq(adminPricingSchema.planCode, plan),
  });
  return data;
};
