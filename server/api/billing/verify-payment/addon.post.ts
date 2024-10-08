const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(
    event,
    z.object({
      hostedpageId: z.string(),
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
    const hostedPageData: any = await getHostedPageDetails({
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

    const apiResponseData: any = {
      userId: userId,
      organizationId: orgId!,
      plan_code: hostedPageData.data.subscription.plan.plan_code,
      subscription_metadata: hostedPageData.data.subscription,
      customer_metadata: hostedPageData.data.subscription.customer,
      subscriptionId: hostedPageData.data.subscription.subscription_id,
      productId: hostedPageData.data.subscription.product_id,
      customerId: hostedPageData.data.subscription.customer_id,
      amount: hostedPageData.data.invoice.sub_total,
      // expiry: data.data.subscription.expiry ?? Date.now(),
      status: "active",
      type: "addon",
    };
    try {
      const billingPromise = await db
        .insert(paymentSchema)
        .values(apiResponseData)
        .returning();
      await Promise.resolve(billingPromise);
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
