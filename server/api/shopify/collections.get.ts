import { getShopifyIntegrationDetails } from "~/server/utils/db/shopify";
import { logger } from "~/server/logger";

export default defineEventHandler(async (event) => {
  try  {
   const query = getQuery(event);
   const shopifyIntegrationId = query.shopifyIntegrationId as string;
   if (!shopifyIntegrationId) {
     throw createError({
       statusCode: 400,
       message: "shopifyIntegrationId query parameter is required",
     });
   }
   logger.info(
     `Fetching Shopify integration details for ID: ${shopifyIntegrationId}`,
   );
   const shopifyIntegration: any = await getShopifyIntegrationDetails(shopifyIntegrationId);
  
   const data: any = await $fetch(`https://${shopifyIntegration.shop}/admin/api/2024-04/smart_collections.json`, {
      method: "GET",
      headers: {
           "X-Shopify-Access-Token": `${shopifyIntegration.access_token}`,
           "Content-Type": "application/json",
      },
   })
 
   return data?.smart_collections;
  } catch(error: any) {
    console.log({ error })
    logger.error(`get shopify collection: error, ${JSON.stringify(error)}`)
    if (error.response?.status === 401) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized access to Shopify API",
      });
    }

    if (error.response?.status === 429) {
      throw createError({
        statusCode: 429,
        message: "Shopify API rate limit exceeded",
      });
    }

    throw createError({
      statusCode: error.response?.status || 500,
      message: `Failed to fetch Shopify products: ${error.message}`,
    });
  }
})