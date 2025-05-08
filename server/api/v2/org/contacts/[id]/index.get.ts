import { logger } from "~/server/logger";
import { getContactInformationById } from "~/server/utils/v2/db/contacts";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event);
    const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

    logger.info(`Fetching contact: ${id}`);

    const retrievedContactData = await getContactInformationById(
      organizationId,
      id,
    );

    if (!retrievedContactData) {
      logger.info(`Contact not found: ${id}`);
      throw createError({
        statusCode: 404,
        message: "Contact not found",
      });
    }

    logger.info(
      `Contact retrieved successfully: ${JSON.stringify(retrievedContactData)}`,
    );

    return retrievedContactData;
  } catch (error) {
    logger.error(
      `Failed to fetch contact: ${error instanceof Error ? error.message : "Unknown error"}`,
    );

    throw createError({
      statusCode: 400,
      message:
        error instanceof Error ? error.message : "Failed to fetch contact",
    });
  }
});
