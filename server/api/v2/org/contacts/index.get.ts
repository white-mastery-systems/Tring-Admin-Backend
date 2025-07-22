import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { getAllContacts } from "~/server/utils/v2/db/contacts";

export default defineEventHandler(async (event) => {
  try {
    const timeZoneHeader = event.node?.req?.headers["time-zone"];
    const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
    const organizationId = await isOrganizationAdminHandler(event);

    const contactQueryParams = await isValidQueryHandler(
      event,
      contactQuerySchema,
    );

    logger.info(`Fetching contacts for orgId: ${organizationId}`);

    const contacts = await getAllContacts(organizationId, contactQueryParams, timeZone);

    return contacts;
  } catch (error) {
    logger.error(
      `Failed to fetch contacts: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return errorResponse(event, 500, `Failed to fetch contacts: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
});
