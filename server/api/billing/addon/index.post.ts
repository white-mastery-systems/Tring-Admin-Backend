const db = useDrizzle();

const planData = [
  {
    plan: "chat_basic",
    price: 200,
  },
  {
    plan: "chat_pro",
    price: 500,
  },
  {
    plan: "chat_max",
    price: 1000,
  },
];

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(
    event,
    z.object({
      plan: z.string(),
      redirectUrl: z.string(),
    }).parse,
  );
  const orgId = await isOrganizationAdminHandler(event);
  if (!orgId) {
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const paymentData = await db.query.paymentSchema.findFirst({
    where: and(
      eq(paymentSchema.organizationId, orgId),
      eq(paymentSchema.status, "active"),
      eq(paymentSchema.type, "subscription"),
    ),
  });
  return await createAddonInZohoBilling({
    body: {
      subscription_id: paymentData?.subscriptionId,
      addons: [
        {
          addon_code: body.plan,
          quantity: 1,
          price: planData?.find(({ plan }) => plan === body.plan)?.price,
          tax_id: null,
        },
      ],
      redirect_url: body?.redirectUrl,
      exchange_rate: 2,
      payment_gateways: [
        {
          payment_gateway: "razorpay",
        },
      ],
    },
  });
});
