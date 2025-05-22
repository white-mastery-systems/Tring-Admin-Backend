import { logger } from "~/server/logger";
import { deleteContactById } from "~/server/utils/v2/db/contacts";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = await isOrganizationAdminHandler(event);
    const { id } = await isValidRouteParamHandler(event, checkPayloadId("id"));

    const deletedContactInfo = await deleteContactById(organizationId, id);

    if (!deletedContactInfo) {
      logger.info(`Contact not found for deletion: ${id}`);
      throw createError({
        statusCode: 404,
        message: "Contact not found",
      });
    }

    logger.info(`Contact deleted: ${id}`);
    return deletedContactInfo;
  } catch (error) {
    logger.error(
      `Delete contact error: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw createError({
      statusCode: 400,
      message:
        error instanceof Error ? error.message : "Failed to delete contact",
    });
  }
});
