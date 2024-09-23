const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("<<>>>>>>>>>");
  if (body.event_type === "subscription_created") {
    const paymentBySubscriptionId = await db.query.paymentSchema.findFirst({
      where: eq(
        paymentSchema.subscriptionId,
        body.data.subscription.subscription_id,
      ),
    });
    if (!paymentBySubscriptionId) {
      if (!body.data.subscription?.customer?.email) {
        return;
      }
      const userDetails = await db.query.authUserSchema.findFirst({
        email: body.data.subscription.customer.email,
      });
      await db
        .update(paymentSchema)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(paymentSchema.organizationId, userDetails?.organizationId),
            eq(paymentSchema.status, "active"),
            eq(paymentSchema.type, "subscription"),
          ),
        )
        .returning();

      const apiResponseData: any = {
        userId: userDetails?.id,
        organizationId: userDetails?.organizationId,
        plan_code: body.data.subscription?.plan?.plan_code,
        subscription_metadata: body.data.subscription,
        customer_metadata: body.data.subscription.customer,
        subscriptionId: body.data.subscription.subscription_id,
        productId: body.data.subscription.product_id,
        customerId: body.data.subscription.customer_id,
        amount: body.data.subscription.amount,
        status: "active",
      };
      const resp = await db
        .insert(paymentSchema)
        .values(apiResponseData)
        .returning();
      const organizationPromise = db
        .update(organizationSchema)
        .set({
          usedQuota: 0,
          planCode: apiResponseData.plan_code,
        })
        .where(eq(organizationSchema.id, userDetails?.organizationId!));
      return resp;
    }
  }

  return true;
});
