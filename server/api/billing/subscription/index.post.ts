import {
  adminConfigurationSchema,
  adminPricingSchema,
} from "~/server/schema/admin";
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
    const userDetails: any = await db.query.authUserSchema.findFirst({
      where: eq(authUserSchema.id, user?.id),
    });
    const organizationId = (await isOrganizationAdminHandler(event)) as string;
    const orgDetails = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, organizationId),
    });
    console.log({ orgDetails, body, user });
    if (orgDetails?.planCode) {
      const planDetails = await db.query.adminPricingSchema.findFirst({
        where: eq(adminPricingSchema.planCode, body?.plan),
      });
      console.log({ planDetails });

      const regerateAccessToken = async () => {
        try {
          console.log(
            `https://accounts.zoho.in/oauth/v2/token?client_id=${metaData?.client_id}&grant_type=refresh_token&client_secret=${metaData?.client_secret}&refresh_token=${metaData?.refresh_token}`,
          );
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
        } catch (err: any) {
          console.log(err.status, "ERRO ON AUTH");
        }
      };

      try {
        let firstName = user?.username;
        let lastName = "";
        if (firstName?.includes(" ")) {
          firstName = firstName?.split(" ")[0];
          lastName = firstName?.split(" ")[1];
        }
        console.log(userDetails, "MOBILE");
        const generatedHostedPage = await await $fetch(
          "https://www.zohoapis.in/billing/v1/hostedpages/newsubscription",
          {
            method: "POST",
            headers: {
              "X-com-zoho-subscriptions-organizationid":
                metaData.organization_id,
              Authorization: `Zoho-oauthtoken ${metaData.access_token}`,
              "content-type": "application/json",
            },

            body: {
              customer: {
                display_name: user?.username,
                salutation: "Mr.",
                first_name: firstName,
                last_name: lastName,
                email: user?.email,
                mobile: `+918848083317`,
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
              plan: {
                plan_code: body.plan,
                price: planDetails?.price,
              },
              redirect_url: body?.redirectUrl,
              payment_gateways: [
                {
                  payment_gateway:
                    body?.locationData?.country === "IN"
                      ? "razorpay"
                      : "razorpay",
                },
              ],
            },
          },
        );
        console.log({ generatedHostedPage });
        return generatedHostedPage;
      } catch (err: any) {
        console.log("ERRRO HAPPEND", err.status, err.data);

        if (err.status === 401) {
          const response = await regerateAccessToken();
        }
      }
    }
  } catch (err) {
    if (err instanceof Error) console.log(err.message, "message");
  }

  return { success: "true" };
});
