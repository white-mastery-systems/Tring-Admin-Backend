import { orgSubscriptionSchema } from "~/server/schema/admin";

const db = useDrizzle();

// Load credentials from JSON file
// const credentialsPath = join(process.cwd(), "zoho_config.json");

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(
    event,
    z.object({
      hostedpageId: z.string(),
      // type: z.optional(z.enum(["subscription", "addon"])),
    }).parse,
  );
  const orgId = await isOrganizationAdminHandler(event);
  if (!orgId) {
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  try {
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    let metaData = zohoData.metaData;
    const data: any = await getHostedPageDetails({
      integrationData: metaData,
      token: metaData.access_token,
      hostedPageId: body.hostedpageId,
    });
    const userId: string | undefined = event.context.user?.id;
    if (!userId) {
      return sendError(
        event,
        createError({ statusCode: 404, statusMessage: "Invalid User" }),
      );
    }
    const activeSubscription: any = await db.query.paymentSchema.findFirst({
      where: eq(paymentSchema.organizationId, orgId),
    });
    if (activeSubscription) {
      const subscriptionDataFromZoho = await cancelSubscriptionFromZohoBilling({
        subscriptionId: activeSubscription.subscriptionId,
      });
    }
    try {
      await db
        .update(paymentSchema)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(paymentSchema.organizationId, orgId),
            eq(paymentSchema.status, "active"),
            eq(paymentSchema.type, "subscription"),
          ),
        )
        .returning();
    } catch (err: any) {}

    const apiResponseData: any = {
      userId: userId,
      organizationId: orgId!,
      plan_code: data.data.subscription.plan.plan_code,
      subscription_metadata: data.data.subscription,
      customer_metadata: data.data.subscription.customer,
      subscriptionId: data.data.subscription.subscription_id,
      productId: data.data.subscription.product_id,
      customerId: data.data.subscription.customer_id,
      amount: data.data.subscription.amount,
      status: "active",
    };
    
    const orgSubscription = {
      organizationId: orgId!,
      botType: "chat",
      subscriptionId: data.data.subscription.subscription_id,
      planCode: data.data.subscription.plan.plan_code,
      expiryDate: data.data.subscription.next_billing_at,
      status: "active"
    }

    try {
      const billingPromise = db
        .insert(paymentSchema)
        .values(apiResponseData)
        .returning();

      const organizationPromise = db
        .update(organizationSchema)
        .set({
          usedQuota: 0,
          planCode: apiResponseData.plan_code,
        })
        .where(eq(organizationSchema.id, orgId!));

      const isOrgSubscriptionExist = await db.query.orgSubscriptionSchema.findFirst({
        where: and(
          eq(orgSubscriptionSchema.organizationId, orgId),
          eq(orgSubscriptionSchema.botType, "chat")
        )
      })
      
      let orgSubscriptionPromise
      if(isOrgSubscriptionExist) {
        orgSubscriptionPromise = db
          .update(orgSubscriptionSchema)
          .set(orgSubscription)
          .where(and(
            eq(orgSubscriptionSchema.organizationId, orgId),
            eq(orgSubscriptionSchema.botType, "chat")
        ))
      } else {
         orgSubscriptionPromise = db
          .insert(orgSubscriptionSchema)
          .values(orgSubscription)
      }
      
      const userPromise = db
        .update(authUserSchema)
        .set({
          customerId: apiResponseData.customerId,
        })
        .where(eq(authUserSchema.id, userId));

      await Promise.allSettled([
        billingPromise,
        organizationPromise,
        orgSubscriptionPromise,
        userPromise,
      ]);
      return { status: "Payment Successful" };
    } catch (error) {
      console.error(`Failed to insert data into DB: ${error}`);
    }
  } catch (error) {
    return {
      error: "Failed to fetch data from Zoho API",
      details: error,
    };
  }
});
