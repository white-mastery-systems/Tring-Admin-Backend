import { BotType } from "../subscription/index.post";

const db = useDrizzle();

const chatAddonPlans = [
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
  {
    plan: "whatsapp_credits_super",
    price: 1000
  },
    {
    plan: "whatsapp_credits_pro",
    price: 5000,
  },
  {
    plan: "whatsapp_credits_ultra",
    price: 10000,
  },
  {
    plan: "whatsapp_credits_supreme",
    price: 20000,
  },
  {
    plan: "whatsapp_credits_max",
    price: 50000,
  },
];

const voiceAddonPlans = [
  {
    plan: "voice_basic",
    price: 5000
  },
  {
    plan: "voice_pro",
    price: 10000
  },
 {
    plan: "voice_max",
    price: 20000
  },
  {
    plan: "voice_ultra",
    price: 30000
  },
  {
    plan: "voice_supreme",
    price: 50000
  }
]

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(
    event,
    z.object({
      plan: z.string(),
      redirectUrl: z.string(),
    }).parse,
  );
  const query = await isValidQueryHandler(event, z.object({
    type: z.nativeEnum(BotType)
  }))
  const orgId = await isOrganizationAdminHandler(event);
  if (!orgId) {
    return createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: Organization ID is missing. Please ensure you have valid access rights.",
    });
  }
  const paymentData = await db.query.paymentSchema.findFirst({
    where: and(
      eq(paymentSchema.organizationId, orgId),
      eq(paymentSchema.status, "active"),
      eq(paymentSchema.type, "subscription"),
    ),
  });
  const orgSubscription = await db.query.orgSubscriptionSchema.findFirst({
    where: and(
      eq(orgSubscriptionSchema.organizationId, orgId),
      eq(orgSubscriptionSchema.botType, query?.type)
    )
  })

  const addonPrice = query?.type === "chat" ? chatAddonPlans?.find(({ plan }) => plan === body.plan)?.price : voiceAddonPlans?.find(({ plan }) => plan === body.plan)?.price
  
  return await createAddonInZohoBilling({
    body: {
      subscription_id: orgSubscription?.subscriptionId || paymentData?.subscriptionId,
      addons: [
        {
          addon_code: body.plan,
          quantity: 1,
          price: addonPrice,
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
