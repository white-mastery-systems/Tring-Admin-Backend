import { cancelSubscriptionFromZohoBilling } from "~/server/utils/zoho/modules";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const orgId = event.context.user?.organizationId;
  if (!orgId) {
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const subscriptionData: any = await db.query.paymentSchema.findFirst({
    where: and(
      eq(paymentSchema.status, "active"),
      eq(paymentSchema.organizationId, orgId),
      eq(paymentSchema.type, "subscription"),
    ),
  });

  const subscriptionDataFromZoho = await cancelSubscriptionFromZohoBilling({
    subscriptionId: subscriptionData.subscriptionId,
  });

  const orgData = await db
    .update(organizationSchema)
    .set({ planCode: "chat_free" })
    .where(eq(organizationSchema.id, orgId));
  return await db
    .update(paymentSchema)
    .set({
      status: "cancelled",
    })
    .where(
      and(
        eq(paymentSchema.organizationId, orgId),
        eq(paymentSchema.status, "active"),
        eq(paymentSchema.type, "subscription"),
      ),
    )
    .returning();
});
