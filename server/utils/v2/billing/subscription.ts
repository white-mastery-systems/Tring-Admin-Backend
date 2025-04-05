import { logger } from "~/server/logger"
import { retrieveZohoBillingNewAccessToken } from "./module";
import { getZohoBillingContactPersons } from "../../db/user";

const config = useRuntimeConfig()

const newsubscriptionPayload = (
  firstName: string, 
  lastName: string,
  currencyCode: string,
  userDetails: any,
  orgDetails: any,
  contactPersonIdList: any,
  customerPricebookId: string,
  body: any
) => {
  return {
      ...(userDetails?.customerId
      ? {
          customer_id: userDetails?.customerId,
        }
      : {
          customer: {
            display_name: userDetails?.username,
            salutation: "Mr.",
            first_name: firstName,
            last_name: lastName,
            email: userDetails?.email,
            mobile: `${userDetails?.countryCode ?? "+91"} ${userDetails.mobile}`,
            currency_code: currencyCode,
            billing_address: {
              attention: userDetails?.username,
              street: userDetails?.address?.street,
              city: userDetails?.address?.city,
              state: userDetails?.address?.state,
              country: userDetails?.address?.country,
              zip: userDetails?.address?.zipCode,
            },
            shipping_address: {
              attention: userDetails?.username,
              street: userDetails?.address?.street,
              city: userDetails?.address?.city,
              state: userDetails?.address?.state,
              country: userDetails?.address?.country,
              zip: userDetails?.address?.zipCode,
            },
             ...(config.envType !== "development" && {
              gst_no: orgDetails?.metadata?.gst,
              gst_treatment: orgDetails?.metadata?.gstType || "business_gst",
            })
          },
        }),
        ...(config.envType !== "development" && {
          gst_no: orgDetails?.metadata?.gst,
          gst_treatment: orgDetails?.metadata?.gstType || "business_gst",
          place_of_supply: getStateCode(userDetails?.address?.state),
        }),
        contactpersons: contactPersonIdList,
        pricebook_id: customerPricebookId,
        plan: {
          plan_code: body.plan,
        },
        redirect_url: body?.redirectUrl,
        payment_gateways: [
          {
            payment_gateway:
              userDetails?.address?.country === "India"
                ? "razorpay"
                : "razorpay",
          },
        ],
  }
}

export const createSubscription: any = async ({
  organizationId,
  userDetails,
  body,
  metaData,
  orgDetails
}: {
  organizationId: string,
  userDetails: any,
  body: any,
  metaData: any,
  orgDetails: any,
}) => {
  try {
    let firstName = userDetails?.username;
    let lastName = "";
    if (firstName?.includes(" ")) {
      firstName = userDetails?.username?.split(" ")[0];
      lastName = userDetails?.username?.split(" ")[1];
    }

    const contactPersonInformations = await getZohoBillingContactPersons(organizationId);
    const contactPersonIdList = contactPersonInformations?.map((i) => ({
      contactperson_id: i.contactPersonId,
    }));

    const priceList = await getPriceList(metaData);
    const currencyCode = (userDetails.address.country === "India" && body.locationData.country === "IN")? "INR" : "USD";
    const customerPricebookId = priceList.pricebooks.find((i: any) => i.currency_code === currencyCode).pricebook_id;

    const subscriptionPayload = newsubscriptionPayload(firstName, lastName, currencyCode, userDetails, orgDetails, contactPersonIdList, customerPricebookId, body)
    logger.info(`Create subscription Request body: ${JSON.stringify(subscriptionPayload)}`);

    const createNewSubscription = await $fetch(
      "https://www.zohoapis.in/billing/v1/hostedpages/newsubscription",
      {
        method: "POST",
        headers: {
          "X-com-zoho-subscriptions-organizationid": metaData.organization_id,
          Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
          "content-type": "application/json",
        },
        body: subscriptionPayload,
      })

    return createNewSubscription
  } catch (error: any) {
    console.log({ error })
    logger.error(`Zoho-billing - createSubscription function Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessTokenMetadata = await retrieveZohoBillingNewAccessToken(metaData)
      return createSubscription({ organizationId, userDetails, body, metaData: regenerateAccessTokenMetadata, orgDetails })
    } else if(error.status === 400) {
      throw new Error(error?.response?.message || "Unable to create subscription") 
    }
  }
}

export const cancelZohoSubscription: any = async(subscriptionId: string, metaData: any)  => {
  try {
    const data = await $fetch(
      `https://www.zohoapis.in/billing/v1/subscriptions/${subscriptionId}/cancel?cancel_at_end=false`,
      {
        method: "POST",
        headers: {
          "X-com-zoho-subscriptions-organizationid": metaData?.organization_id!,
          Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
          "content-type": "application/json"
        }
      }
    );
    return data
  } catch(error: any) {
    logger.error(`Zoho-billing cancel subscription function Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessTokenMetadata = await retrieveZohoBillingNewAccessToken(metaData)
      return cancelZohoSubscription(subscriptionId, regenerateAccessTokenMetadata)
    } else if(error.status === 400) {
      throw new Error(error?.response?.message || "Unable to cancel subscription") 
    }
  }
}

















