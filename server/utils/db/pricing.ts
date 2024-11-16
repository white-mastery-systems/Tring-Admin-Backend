const db = useDrizzle();

export const getPricingInformation = async (plan: string) => {
  const data = await db.query.adminPricingSchema.findFirst({
    where: and(
      eq(adminPricingSchema.planCode, plan),
      eq(adminPricingSchema.isIndiaPricing, true)
    ),
  });
  return data;
};
