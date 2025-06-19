import { logger } from "~/server/logger"

const config = useRuntimeConfig()

export const createAddon: any = async (addonData: any, metaData: any) => {
  try {
     const data = await $fetch(
      `https://www.zohoapis.in/billing/v1/hostedpages/buyonetimeaddon`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
          "X-com-zoho-subscriptions-organizationid":
            metaData?.organization_id,
        },
        body: addonData,
      },
    );
    return data
  } catch(error: any) {
    logger.error(`Zoho billing create Addon module Error: ${JSON.stringify(error?.message)}`)
    if (error?.status === 401) {
      const updatedIntegrationMetaData: any = await retrieveZohoBillingNewAccessToken(metaData)
      return createAddon(addonData, updatedIntegrationMetaData)
    }
    throw new Error(error)
  }
}

export const createZohoBillingCustomCredit: any = async (creditData: any, metaData: any) => {
  try {
    const data = await $fetch(`https://www.zohoapis.in/billing/v1/addons`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
        "X-com-zoho-subscriptions-organizationid":
          metaData?.organization_id,
      },
      body: creditData,
    })
    return data
  } catch(error: any) {
    logger.error(`Zoho billing create Custom Credit API Error: ${JSON.stringify(error?.message)}`)
    if (error?.status === 401) {
      const updatedIntegrationMetaData: any = await retrieveZohoBillingNewAccessToken(metaData)
      return createZohoBillingCustomCredit(creditData, updatedIntegrationMetaData)
    }
    throw new Error(error)
  }
}

export const getZohoBillingCredits: any = async (metaData: any) => {
  try {
    const data = await $fetch(`https://www.zohoapis.in/billing/v1/addons?filter_by=ACTIVE`, {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
        "X-com-zoho-subscriptions-organizationid":
          metaData?.organization_id,
      },
    })
    return data
  } catch(error: any) {
    logger.error(`Zoho billing Get Credits API Error: ${JSON.stringify(error?.message)}`)
    if (error?.status === 401) {
      const updatedIntegrationMetaData: any = await retrieveZohoBillingNewAccessToken(metaData)
      return getZohoBillingCredits(updatedIntegrationMetaData)
    }
    throw new Error(error)
  }
}

export const createPaymentLinkInRazorpay = async (payload: any) => {
  try {
    const credentials = btoa(`${config.razorpayApiKey}:${config.razorpayApiSecret}`);
    const data = await $fetch(`https://api.razorpay.com/v1/payment_links/`, {
      method: "POST",
      body: payload,
      headers: {
        Authorization: `Basic ${credentials}`
      }
    })

    return data

  } catch (error: any) {
    logger.error(`Create Payment link in Razorpay API Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

export const getRazorpayPaymentDetailByPaymentId = async (paymentId: string) => {
  try {
    const credentials = btoa(`${config.razorpayApiKey}:${config.razorpayApiSecret}`);
    const data = await $fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`
      }
    })

    return data
  } catch (error: any) {
    logger.error(`Get Payment Details By Razorpay payment-id API Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}