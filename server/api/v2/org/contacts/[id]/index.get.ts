import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
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
      return errorResponse(event, 404, "Contact not found")
    }

    logger.info(
      `Contact retrieved successfully: ${JSON.stringify(retrievedContactData)}`,
    );

    return retrievedContactData;
  } catch (error) {
    logger.error(
      `Failed to fetch contact: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return errorResponse(event, 500, "Failed to fetch contact")
  }
});
