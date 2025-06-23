import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import {
  addContact,
  checkIfContactExists,
  ContactSource,
} from "~/server/utils/v2/db/contacts";

export default defineEventHandler(async (event) => {
  try {
    const contactInfoPayload = await isValidBodyHandler(
      event,
      contactInfoSchema
    );

    const organizationId = event?.context?.user?.organizationId ?? contactInfoPayload.organizationId
    logger.info(`Processing contact creation for org: ${organizationId}`);

    const existingContact = await checkIfContactExists(
      organizationId,
      contactInfoPayload.phoneNumber,
      "insert"
    );

    if (existingContact) {
      logger.info(
        `Duplicate phone: ${contactInfoPayload.phoneNumber} for contact creation`,
      );
      return errorResponse(event, 409, "Contact already exists with this phone number")
    }

    const newContact = await addContact({ 
      ...contactInfoPayload,
      organizationId, 
      source: contactInfoPayload?.source ?? ContactSource.MANUAL
    });
    logger.info(`Contact created: ${JSON.stringify(newContact[0])}`);

    return {
      status: "success",
      data: newContact[0],
    };
  } catch (error) {
    logger.error(
      `Contact creation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return errorResponse(event, 409, "Failed to create contact")
  }
});
