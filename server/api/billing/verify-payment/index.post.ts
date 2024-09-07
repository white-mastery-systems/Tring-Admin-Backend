const db = useDrizzle();

// Load credentials from JSON file
// const credentialsPath = join(process.cwd(), "zoho_config.json");

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(
    event,
    z.object({ hostedpageId: z.string() }).parse,
  );
  console.log({ body });

  // return hostedPageId;
  const orgId = await isOrganizationAdminHandler(event);
  try {
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    let metaData = zohoData.metaData;
    console.log({ metaData });
    const data: any = await getHostedPageDetails({
      integrationData: metaData,
      token: metaData.access_token,
      hostedPageId: body.hostedpageId,
    });
    console.log({ data: JSON.stringify(data) });
    const userId: string | undefined = event.context.user?.id;
    if (!userId) {
      return sendError(
        event,
        createError({ statusCode: 404, statusMessage: "Invalid User" }),
      );
    }
    const apiResponseData = {
      user_id: userId,
      org_id: orgId!,
      customer_id: data.data.subscription.customer.customer_id,
      plan_code: data.data.subscription.plan.plan_code,
      subscription_metadata: data.data.subscription,
      customer_metadata: data.data.subscription.customer,
      subscriptionId: data.data.subscription.subscription_id,
      productId: data.data.subscription.product_id,
      customerId: data.data.subscription.customer_id,
      status: "active",
    };
    try {
      const billingPromise = db
        .insert(billingSchema)
        .values(apiResponseData)
        .returning();
      const organizationPromise = db
        .update(organizationSchema)
        .set({
          usedQuota: 0,
          planCode: apiResponseData.plan_code,
        })
        .where(eq(organizationSchema.id, orgId!));
      await Promise.allSettled([billingPromise, organizationPromise]);
      return { status: "Payment Successful" };
      return data;
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
