import { getShopifyIntegrationDetails } from "~/server/utils/db/shopify";
import { logger } from "~/server/logger";

export default defineEventHandler(async (event) => {
  try {
    const { shopifyIntegrationId } = await readBody(event);

    logger.info(
      `Fetching Shopify integration details for ID: ${shopifyIntegrationId}`,
    );
    const shopifyIntegration =
      await getShopifyIntegrationDetails(shopifyIntegrationId);

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

    const shopifyProductsApiUrl = `https://${shopifyIntegration.shop}/admin/api/2024-04/products.json`;

    logger.info(`Fetching products from Shopify API: ${shopifyProductsApiUrl}`);
    const shopifyResponse: any = await $fetch(shopifyProductsApiUrl, {
      headers: {
        "X-Shopify-Access-Token": `${shopifyIntegration.access_token}`,
        "Content-Type": "application/json",
      },
    });

    logger.info(
      `Successfully fetched ${shopifyResponse.products.length} products from Shopify`,
    );

    return shopifyResponse.products;
  } catch (error: any) {
    logger.error(`Error fetching Shopify products: ${error.message}`);
    throw createError({
      statusCode: error.response?.status || 500,
      message: `Failed to fetch Shopify products: ${error.message}`,
    });
  }
});
