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

export const getSubscriptionPricingByCountry = async(country: string) => {
  return await db.query.adminPricingSchema.findMany({
    where: country === "India" ? eq(adminPricingSchema.isIndiaPricing, true) : eq(adminPricingSchema.isIndiaPricing, false)
  });
}

export const getSubcriptionPlanDetailByPlanCode = async (planCode: string, country: string) => {
  return await db.query.adminPricingSchema.findFirst({
    where: and(
      eq(adminPricingSchema.planCode, planCode),
      country === "India" 
      ? eq(adminPricingSchema.isIndiaPricing, true) 
      : eq(adminPricingSchema.isIndiaPricing, false)
    )
  })
}

export const getAllPricing = async () => {
   return await db.query.adminPricingSchema.findMany({
    where: eq(adminPricingSchema.isIndiaPricing, true) 
   })
}