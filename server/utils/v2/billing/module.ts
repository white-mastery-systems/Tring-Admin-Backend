import { logger } from "~/server/logger";
import { updateAdminConfig } from "../../db/adminConfig";

export const retrieveZohoBillingNewAccessToken = async (metadata: any) => {
  try {
    const refreshTokenResponse: any = await $fetch(
      `https://accounts.zoho.in/oauth/v2/token?client_id=${metadata?.client_id}&grant_type=refresh_token&client_secret=${metadata?.client_secret}&refresh_token=${metadata?.refresh_token}`,
      {
        method: "POST",
      },
    ); 

    const updatedMetadata = { ...metadata, ...refreshTokenResponse };
    await updateAdminConfig(updatedMetadata);
    
    return updatedMetadata;
  } catch (error: any) {
    logger.error(`Failed to regenerate access token: ${JSON.stringify(error.message)}`);
    throw new Error("Failed to regenerate access token");
  }
};

export const getZohoBillingPriceList: any = async (integrationData: any) => {
  try {
    const priceList = await $fetch(`https://www.zohoapis.in/billing/v1/pricebooks`,{
        method: "GET",
        headers: {
          Authorization: `Zoho-oauthtoken ${integrationData?.access_token}`,
          "X-com-zoho-subscriptions-organizationid":
            integrationData?.organization_id,
        },  
    })
    return priceList
  } catch (error: any) {
    logger.error(
      `getPriceList: integrationData: ${JSON.stringify(integrationData)}, error: ${JSON.stringify(error.message)}`,
    );
    if (error.status === 401) {
      const updatedIntegrationMetaData: any = await retrieveZohoBillingNewAccessToken(integrationData)
      return getPriceList(updatedIntegrationMetaData)
    }
    throw new Error("Failed to get Zoho-billing price-list");
  }
}

export const getZohoBillingHostedPageDetails: any = async (hostedPageId: string, metaData: any) => {
  try {
    const response = await $fetch(
      `https://www.zohoapis.in/billing/v1/hostedpages/${hostedPageId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Zoho-oauthtoken ${metaData?.access_token}`,
          "X-com-zoho-subscriptions-organizationid":
            metaData?.organization_id,
          "Content-Type": "application/json",
        },
      },
    )
    return response
  } catch (error: any) {
    logger.error(`getZohoBillingHostedPageDetails Error: ${JSON.stringify(error.message)}`)
    if (error.status === 401) {
      const updatedIntegrationMetaData: any = await retrieveZohoBillingNewAccessToken(metaData)
      return getZohoBillingHostedPageDetails(hostedPageId, updatedIntegrationMetaData)
    }
    throw new Error(error)
  }
}