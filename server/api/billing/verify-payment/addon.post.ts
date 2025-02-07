const db = useDrizzle();
import { billingLogger } from "~/server/logger";
import { orgSubscriptionSchema } from "~/server/schema/admin";

export default defineEventHandler(async (event) => {
  const query = await isValidQueryHandler(event, z.object({
    type: z.string().optional()
  }))
  const body = await readValidatedBody(
    event,
    z.object({
      hostedpageId: z.string(),
      // botType: z.string()
    }).parse,
  );
  const orgId = await isOrganizationAdminHandler(event);
  if (!orgId) {
    return createError({
      statusCode: 401,
      statusMessage:
        "Unauthorized: Organization ID is missing. Please ensure you have valid access rights.",
    });
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

    let botType : string
  
    const getBotType = await getPricingInformation(hostedPageData.data.subscription.plan.plan_code)
    botType = getBotType?.type === "chatbot" ? "chat" : "voice"

    const userId: string | undefined = event.context.user?.id;
    if (!userId) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage:
            "User Not Found: The specified user could not be found. Please check the user ID.",
        }),
      );
    }
    billingLogger.info(`addon.post, hostedPageData: ${JSON.stringify(hostedPageData)}`)
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
      addonCode: hostedPageData.data.invoice.invoice_items[0].code,
      // expiry: data.data.subscription.expiry ?? Date.now(),
      status: "active",
      type: "addon",
    };
    try {
      const billingPromise = await db
        .insert(paymentSchema)
        .values(apiResponseData)
        .returning();

       // get Pricing information
      const pricingInformation = await getPricingInformation(apiResponseData.plan_code)

      // // get Addons information
      // const orgAddons = await db
      //   .select()
      //   .from(paymentSchema)
      //   .where(
      //     and(
      //       eq(paymentSchema.plan_code, apiResponseData.plan_code),
      //       eq(paymentSchema.organizationId, orgId),
      //       eq(paymentSchema.type, "addon"),
      //     ),
      // )

      // const walletSessions = orgAddons.reduce((acc, i) => {
      //   const addon: any = pricingInformation?.addons?.find((j: any) => i.addonCode === j.name);
      //   return addon ? acc + addon?.sessions : acc;
      // }, 0);
      let addons = 0
      if(query.type === "whatsapp"){
        addons = hostedPageData.data.invoice.sub_total
      }
      else {
        const addonInfo: any = pricingInformation?.addons?.find((j: any) => j.name === apiResponseData.addonCode);
        addons = addonInfo.sessions
      }


      const existingWallet = await db.query.orgSubscriptionSchema.findFirst({
       where: and(
          eq(orgSubscriptionSchema.organizationId, orgId),
          eq(orgSubscriptionSchema.botType, botType)
        ) 
      })

      await db
        .update(orgSubscriptionSchema)
        .set({
          status: "active",
          ...(query.type === "whatsapp" ?
          {
            whatsappWallet: (existingWallet?.whatsappWallet || 0) + (addons || 0)
          } : {
            walletSessions: (existingWallet?.walletSessions || 0) + (addons || 0),
          }),
          updatedAt: new Date()
        })
        .where(and(
            eq(orgSubscriptionSchema.organizationId, orgId),
            eq(orgSubscriptionSchema.botType, botType)
          ));
  
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
