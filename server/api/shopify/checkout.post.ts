import { getShopifyIntegrationDetails } from "~/server/utils/db/shopify";
import { logger } from "~/server/logger";

export default defineEventHandler(async (event) => {
  const { lineItems, shopifyIntegrationId } = await readBody(event);

  if (!lineItems || lineItems.length === 0) {
    logger.error("Missing or empty lineItems in the request body");
    throw createError({
      statusCode: 400,
      message: "Missing or empty lineItems in the request body",
    });
  }

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

  logger.info(`Creating checkout for Shopify shop: ${shopifyIntegration.shop}`);
  const shopifyCheckoutApiUrl = `https://${shopifyIntegration.shop}/admin/api/2023-04/checkouts.json`;

  try {
    const shopifyResponse: any = await $fetch(shopifyCheckoutApiUrl, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": `${shopifyIntegration.access_token}`,
        "Content-Type": "application/json",
      },
      body: {
        checkout: {
          line_items: lineItems,
        },
      },
    });

    logger.info(
      `Successfully created checkout with ID: ${shopifyResponse.checkout.id}`,
    );
    return shopifyResponse.checkout;
  } catch (error: any) {
    logger.error(`Error creating Shopify checkout: ${error.message}`);
    throw createError({
      statusCode: error.response?.status || 500,
      message: `Failed to create Shopify checkout: ${error.message}`,
    });
  }
});
