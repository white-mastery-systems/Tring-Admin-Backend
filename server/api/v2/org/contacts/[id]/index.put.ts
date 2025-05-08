import { logger } from "~/server/logger";
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

    const updatedContact = await updateContactById(
      organizationId,
      id,
      contactInfoPayload,
    );

    if (!updatedContact) {
      logger.info(`Contact not found for update: ${id}`);
      throw createError({
        statusCode: 404,
        message: "Contact not found",
      });
    }

    logger.info(`Contact updated: ${id}`);
    return updatedContact[0];
  } catch (error) {
    logger.error(
      `Update contact error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );

    throw createError({
      statusCode: 400,
      message:
        error instanceof Error ? error.message : "Failed to update contact",
    });
  }
});
