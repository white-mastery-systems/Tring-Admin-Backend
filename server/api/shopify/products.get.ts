import { getShopifyIntegrationDetails } from "~/server/utils/db/shopify";
import { logger } from "~/server/logger";

export default defineEventHandler(async (event) => {
  try {
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

    if (!shopifyIntegration) {
      logger.error(
        `Shopify integration not found for ID: ${shopifyIntegrationId}`,
      );
      throw createError({
        statusCode: 404,
        message: `Shopify integration with ID ${shopifyIntegrationId} not found.`,
      });
    }

    logger.info(
      `Shopify integration found for shop: ${shopifyIntegration.shop}`,
    );
    
    let shopifyProductsApiUrl
    
    if(query?.productIds) {
      shopifyProductsApiUrl = `https://${shopifyIntegration.shop}/admin/api/2024-04/products.json?ids=${query.productIds}`;
    } else {
      shopifyProductsApiUrl = `https://${shopifyIntegration.shop}/admin/api/2024-04/products.json`;
    }

    // Using Nitro's built-in $fetch
    logger.info(`Fetching products from Shopify API: ${shopifyProductsApiUrl}`);
    const shopifyResponse = await $fetch<{ products: any[] }>(
      shopifyProductsApiUrl,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": `${shopifyIntegration.access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    logger.info(
      `Successfully fetched ${shopifyResponse.products.length} products from Shopify`,
    );

    setHeader(event, "Cache-Control", "public, max-age=60");

    return shopifyResponse.products;
  } catch (error: any) {
    logger.error(`Error fetching Shopify products: ${error.message}`);

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
});
