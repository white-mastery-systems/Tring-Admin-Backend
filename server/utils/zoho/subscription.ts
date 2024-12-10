import { logger } from "~/server/logger";
import { getStateCode } from "~/server/utils/billing.utils";

const db = useDrizzle()
const config = useRuntimeConfig();

const regerateAccessToken = async (metaData: any, zohoData: any) => {
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

export const runHostedPageApi: any = async ({ accessToken, user, organizationId, userDetails, orgDetails, body, metaData, zohoData } :
{
  accessToken: string;
  user: any,
  organizationId: string,
  userDetails: any,  
  orgDetails: any,
  body: any,
  metaData: any,
  zohoData: any
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
    // get contact-persons
    const contactPersonInformations =
      await db.query.authUserSchema.findMany({
        where: and(
          eq(authUserSchema.organizationId, organizationId),
          isNotNull(authUserSchema.contactPersonId),
        ),
      });
    const contactPersonIdList = contactPersonInformations?.map((i) => ({
      contactperson_id: i.contactPersonId,
    }));
   

    const priceList = await getPriceList(metaData)
    const currencyCode = (userDetails.address.country === "India" && body.locationData.country === "IN")? "INR" : "USD"

    const customerPricebook = priceList.pricebooks.find((i: any) => i.currency_code === currencyCode)

    // console.log({ customerPricebook })

    const reqObj = {
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
            currency_code: currencyCode,
            billing_address: {
              attention: user?.username,
              street: userDetails?.address?.street,
              city: userDetails?.address?.city,
              state: userDetails?.address?.state,
              country: userDetails?.address?.country,
              zip: userDetails?.address?.zipCode,
            },
            shipping_address: {
              attention: user?.username,
              street: userDetails?.address?.street,
              city: userDetails?.address?.city,
              state: userDetails?.address?.state,
              country: userDetails?.address?.country,
              zip: userDetails?.address?.zipCode,
            },
             ...(config.envType !== "stage" && {
              gst_no: orgDetails?.metadata?.gst,
              gst_treatment: "business_gst",
            })
          },
        }),
        ...(config.envType !== "stage" && {
          gst_no: orgDetails?.metadata?.gst,
          gst_treatment: "business_gst",
          place_of_supply: getStateCode(userDetails?.address?.state),
        }),
        contactpersons: contactPersonIdList,
        pricebook_id: customerPricebook?.pricebook_id,
        plan: {
          plan_code: body.plan,
        },
        redirect_url: body?.redirectUrl,
        // payment_gateways: [
        //   {
        //     payment_gateway:
        //       userDetails?.address === "india"
        //         ? "razorpay"
        //         : "razorpay",
        //   },
        // ],
        payment_gateways: [
          {
            payment_gateway:
              userDetails?.address?.country === "India"
                ? "razorpay"
                : "razorpay",
          },
        ],
    }
    logger.info(`subscription body, ${JSON.stringify(reqObj)}`)
  
    const generatedHostedPage = await $fetch(
      "https://www.zohoapis.in/billing/v1/hostedpages/newsubscription",
      {
        method: "POST",
        headers: {
          "X-com-zoho-subscriptions-organizationid": metaData.organization_id,
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "content-type": "application/json",
        },
        body: reqObj,
      },
    );
    return generatedHostedPage;
  } catch (err: any) {
    logger.error(
      `Error creating hosted page: ${err.message} ${JSON.stringify(err?.data)} ${JSON.stringify(err)} `,
    );
    if (err.status === 401) {
      const response = await regerateAccessToken(metaData, zohoData);
      // return generatedHostedPage();
      return runHostedPageApi({ accessToken: response.access_token, user, organizationId, userDetails, orgDetails, body, metaData, zohoData });
    } else if (err.status === 400) {
      console.log(err.data);
      return createError({
        statusCode: 400,
        statusMessage: err.data.message,
      });
    }
  }
};