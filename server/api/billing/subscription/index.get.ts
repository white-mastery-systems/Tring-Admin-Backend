const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const orgId = event.context.user?.organizationId;
  if (!orgId) {
    return createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: Organization ID is missing. Please ensure you have valid access rights.",
    });
  }
  const activeSubscription = await db.query.paymentSchema.findFirst({
    where: and(
      eq(paymentSchema.organizationId, orgId),
      eq(paymentSchema.status, "active"),
      eq(paymentSchema.type, "subscription"),
    ),
  });
  return activeSubscription;
});
