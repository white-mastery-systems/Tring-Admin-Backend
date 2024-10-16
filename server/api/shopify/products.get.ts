import { getIntegrationDetails } from "~/server/utils/db/shopify";
import { logger } from "~/server/logger";

export default defineEventHandler(async (event) => {
  const { integrationId } = await readBody(event);

  const integrationMetadata = await getIntegrationDetails(integrationId);

  logger.info("integrationMetadata", integrationMetadata);

  if (!integrationMetadata) {
    throw createError({
      statusCode: 404,
      message: `Integration with ID ${integrationId} not found.`,
    });
  }

  const shopifyApiUrl = `https://${integrationMetadata.shop}/admin/api/2023-04/products.json`;

  const response = await $fetch(shopifyApiUrl, {
    headers: {
      "X-Shopify-Access-Token": `${integrationMetadata.access_token}`,
      "Content-Type": "application/json",
    },
  });

  logger.info("Products", response);

  return response;
});
