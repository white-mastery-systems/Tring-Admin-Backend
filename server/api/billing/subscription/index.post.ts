interface zohoConfigInterface {
  metaData: {
    client_id: string;
    client_secret: string;
    refresh_token: string;
    access_token: string;
    organization_id: string;
    code: string;
  };
}
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log({ newBody: JSON.stringify(body) });
  // const http = require("https");

  const db = useDrizzle();
  try {
    const zohoData: any = await db.query.adminConfigurationSchema.findFirst({
      where: eq(adminConfigurationSchema.id, 1),
    });
    let metaData = {
      ...zohoData.metaData,
    };
    const user = event.context.user;
    if (!user) {
      return sendError(
        event,
        createError({ statusCode: 404, statusMessage: "Invalid User" }),
      );
    }
    const userDetails: any = await db.query.authUserSchema.findFirst({
      where: eq(authUserSchema.id, user?.id),
    });
    const organizationId = (await isOrganizationAdminHandler(event)) as string;
    const orgDetails = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, organizationId),
    });

    if (orgDetails?.planCode) {
      const planDetails = await db.query.adminPricingSchema.findFirst({
        where: eq(adminPricingSchema.planCode, body?.plan),
      });

      const regerateAccessToken = async () => {
        try {
          const newAuthInfo: any = await $fetch(
            `https://accounts.zoho.in/oauth/v2/token?client_id=${metaData?.client_id}&grant_type=refresh_token&client_secret=${metaData?.client_secret}&refresh_token=${zohoData?.metaData?.refresh_token}`,
            {
              method: "POST",
            },
          );
          metaData = { ...metaData, ...newAuthInfo };
          await db
            .update(adminConfigurationSchema)
            .set({ metaData: metaData })
            .where(eq(adminConfigurationSchema.id, 1));
          return newAuthInfo;
        } catch (err: any) {}
      };

      const runHostedPageApi = async ({
        accessToken,
      }: {
        accessToken: string;
      }) => {
        try {
          let firstName = user?.username;
          let lastName = "";
          if (firstName?.includes(" ")) {
            firstName = firstName?.split(" ")[0];
            lastName = firstName?.split(" ")[1];
          }
          const billingInformation = await db.query.paymentSchema.findFirst({
            where: eq(paymentSchema.organizationId, organizationId),
          });
<<<<<<< HEAD
=======
          
          // get contact-persons
          const contactPersonInformations = await db.query.authUserSchema.findMany({
            where: and(
              eq(authUserSchema.organizationId, organizationId),
              isNotNull(authUserSchema.contactPersonId)
            )
          })

          const contactPersonIdList = contactPersonInformations?.map((i) => ({ contactperson_id: i.contactPersonId }))

>>>>>>> 530550ac6624508ed1c25a674a451b4a3a65f9dc
          const generatedHostedPage = await $fetch(
            "https://www.zohoapis.in/billing/v1/hostedpages/newsubscription",
            {
              method: "POST",
              headers: {
                "X-com-zoho-subscriptions-organizationid":
                  metaData.organization_id,
                Authorization: `Zoho-oauthtoken ${accessToken}`,
                "content-type": "application/json",
              },
              body: {
                ...(billingInformation?.customerId
                  ? {
                      customer_id: billingInformation?.customerId,
                    }
                  : {
                      customer: {
                        display_name: user?.username,
                        salutation: "Mr.",
                        first_name: firstName,
                        last_name: lastName,
                        email: user?.email,
                        mobile: `${userDetails?.countryCode ?? "+91"} ${userDetails.mobile}`,
                        billing_address: {
                          attention: user?.username,
                          street: userDetails?.address?.street,
                          city: userDetails?.address?.city,
                          state: userDetails?.address?.state,
                          country: userDetails?.address?.country,
                          zip: userDetails?.address?.zip,
                        },
                        shipping_address: {
                          attention: user?.username,
                          street: userDetails?.address?.street,
                          city: userDetails?.address?.city,
                          state: userDetails?.address?.state,
                          country: userDetails?.address?.country,
                          zip: userDetails?.address?.zip,
                        },
                      },
                    }),
                
                contactpersons: contactPersonIdList,
                plan: {
                  plan_code: body.plan,
                },
                redirect_url: body?.redirectUrl,
                payment_gateways: [
                  {
                    payment_gateway:
                      userDetails?.address === "india"
                        ? "razorpay"
                        : "razorpay",
                  },
                ],
              },
            },
          );
          return generatedHostedPage;
        } catch (err: any) {
          console.log({ err: err.message, errda: err.data });
          if (err.status === 401) {
            console.log("FAILED");
            const response = await regerateAccessToken();
            // return generatedHostedPage();
            return runHostedPageApi({ accessToken: response?.access_token });
          }
        }
      };
      const data = await runHostedPageApi({
        accessToken: metaData.access_token,
      });
      return data;
    }
  } catch (err) {
    if (err instanceof Error) {
    }
  }

  return { success: "true" };
});
