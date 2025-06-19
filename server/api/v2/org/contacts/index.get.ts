import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { getAllContacts } from "~/server/utils/v2/db/contacts";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event);

    const contactQueryParams = await isValidQueryHandler(
      event,
      contactQuerySchema,
    );

    logger.info(`Fetching contacts for orgId: ${organizationId}`);

    const contacts = await getAllContacts(organizationId, contactQueryParams);

    logger.info(
      `Retrieved ${contacts.length} contacts for orgId: ${organizationId}`,
    );

    return contacts;
  } catch (error) {
    logger.error(
      `Failed to fetch contacts: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return errorResponse(event, 500, `Failed to fetch contacts: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
});
