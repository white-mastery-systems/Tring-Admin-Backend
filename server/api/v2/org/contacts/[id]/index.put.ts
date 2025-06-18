import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import { updateContactById } from "~/server/utils/v2/db/contacts";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event);
    const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));
    logger.info(`Updating contact: ${id}`);

    const contactInfoPayload = await isValidBodyHandler(
      event,
      contactInfoSchema,
    );
    logger.info(`Contact info payload: ${JSON.stringify(contactInfoPayload)}`);

    const existingContact = await checkIfContactExists(
      organizationId,
      contactInfoPayload.phoneNumber,
      "update",
      id
    );

    if (existingContact) {
      logger.info(
        `Duplicate phone: ${contactInfoPayload.phoneNumber} for contact creation`,
      );
      return errorResponse(event, 409, "Contact already exists with this phone number")
    }

    const updatedContact = await updateContactById(
      organizationId,
      id,
      contactInfoPayload,
    );

    if (!updatedContact) {
      logger.info(`Contact not found for update: ${id}`);
      return errorResponse(event, 404, "Contact not found")
    }

    logger.info(`Contact updated: ${id}`);
    return updatedContact[0];
  } catch (error) {
    logger.error(
      `Update contact error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return errorResponse(event, 500, "Failed to update contact")
  }
});
