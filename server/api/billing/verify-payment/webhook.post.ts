import { addDays } from "date-fns";
import { billingLogger } from "~/server/logger";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // console.log({ body: JSON.stringify(body) });
  billingLogger.info(
    `subscription-${body.event_type}---${JSON.stringify(body)}`,
  );
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
        where: eq(authUserSchema.email, body.data.subscription.customer.email),
      });
      console.log({ userDetails });
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
      const paymentResult = await db
        .insert(paymentSchema)
        .values(apiResponseData)
        .returning();
      const organizationPromise = await db
        .update(organizationSchema)
        .set({
          usedQuota: 0,
          planCode: apiResponseData.plan_code,
        })
        .where(eq(organizationSchema.id, userDetails?.organizationId!));

      return paymentResult;
    }
  } else {
    if (!body.data.subscription?.customer?.email) {
      return;
    }
    const userDetails = await db.query.authUserSchema.findFirst({
      where: eq(authUserSchema.email, body.data.subscription.customer.email),
    });
    const existingBill = await db.query.paymentSchema.findFirst({
      where: and(
        eq(
          paymentSchema.subscriptionId,
          body.data.subscription.subscription_id,
        ),
        eq(paymentSchema.organizationId, userDetails?.organizationId),
        eq(paymentSchema.status, "active"),
      ),
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
    let nextMonthAndDayDate = addDays(new Date(), 1);
    if (existingBill) {
      nextMonthAndDayDate = addDays(new Date(existingBill.expiry), 1);
    }
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
      expiry: nextMonthAndDayDate,
      status: "active",
    };
    const resp = await db
      .insert(paymentSchema)
      .values(apiResponseData)
      .returning();
    const organizationPromise = await db
      .update(organizationSchema)
      .set({
        usedQuota: 0,
        planCode: apiResponseData.plan_code,
      })
      .where(eq(organizationSchema.id, userDetails?.organizationId!));
    console.log(organizationPromise);
    return resp;
  }

  return true;
});
