import { logger } from "~/server/logger"
import { retrieveZohoBillingNewAccessToken } from "./module";
import { getZohoBillingContactPersons } from "../../db/user";

const config = useRuntimeConfig()

const subscriptionPayload = (
  userDetails: any,
  orgDetails: any,
  contactPersonIdList: any,
  customerPricebookId: string,
  body: any,
  currencyCode: string
) => {
  return {
    ...(body.subscriptionId ? { 
      subscription_id: body.subscriptionId 
    } : {
        customer_id: userDetails?.customerId,
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
      exclude_trial: true,
    },
    redirect_url: body?.redirectUrl,
    payment_gateways: [
      {
        payment_gateway: currencyCode === "INR" ? "razorpay" : "stripe",
      },
    ],
  }
}

export const upsertSubscription: any = async ({
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
    const contactPersonInformations = await getZohoBillingContactPersons(organizationId);
    const contactPersonIdList = contactPersonInformations?.map((i) => ({
      contactperson_id: i.contactPersonId,
    }));

    const priceList = await getPriceList(metaData);
    const currencyCode = body.locationData.country === "IN" ? "INR" : "USD";
    const customerPricebookId = priceList.pricebooks.find((i: any) => i.currency_code === currencyCode).pricebook_id;

    const payload = subscriptionPayload(userDetails, orgDetails, contactPersonIdList, customerPricebookId, body, currencyCode)
    logger.info(`upsertSubscription Request body: ${JSON.stringify(payload)}`);

    const upsertSubscription = await $fetch(
      `https://www.zohoapis.in/billing/v1/hostedpages/${body.subscriptionId ? "updatesubscription" : "newsubscription"}`,
      {
        method: "POST",
        headers: {
          "X-com-zoho-subscriptions-organizationid": metaData.organization_id,
          Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
          "content-type": "application/json",
        },
        body: payload,
      })

    return upsertSubscription
  } catch (error: any) {
    console.log({ error })
    logger.error(`Zoho-billing - upsertSubscription function Error: ${JSON.stringify(error.message)}`)
    if(error.status === 401) {
      const regenerateAccessTokenMetadata = await retrieveZohoBillingNewAccessToken(metaData)
      return upsertSubscription({ organizationId, userDetails, body, metaData: regenerateAccessTokenMetadata, orgDetails })
    } else if(error.status === 400) {
      throw new Error(error?.response?.message || "Unable to update subscription") 
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
    } else {
      throw new Error("Unable to cancel subscription") 
    }
  }
}

















