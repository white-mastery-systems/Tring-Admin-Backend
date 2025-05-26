import { logger } from "~/server/logger"

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