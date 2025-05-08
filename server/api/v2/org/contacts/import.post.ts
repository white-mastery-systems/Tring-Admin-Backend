import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import {
  addMultipleContacts,
  ContactSource,
  filterContactsByPhoneNumber,
  mapUniqueContacts,
  parseContactImportFile,
} from "~/server/utils/v2/db/contacts";

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const formData = await readMultipartFormData(event);
    if (!formData) return errorResponse(event, 500, "Invalid Data");

    const fileField = formData.find((item) => item.name === "file");
    if (!fileField) return errorResponse(event, 500, "No file uploaded");

    const { filename, data: contactFormData }: any = fileField;
    const fileExtension = filename?.split(".").pop().toLowerCase();

    const validContactData = await parseContactImportFile(
      contactFormData,
      fileExtension,
    );

    // Extract phone numbers
    const phoneNumbers = validContactData
      .map((contact: any) => contact["Phone Number"])
      .filter(Boolean);

    // Query the database to find existing phone numbers
    const existingContacts = await filterContactsByPhoneNumber(
      organizationId,
      phoneNumbers,
    );

    const existingPhoneNumbers = new Set(
      existingContacts.map((contact: any) => contact.phoneNumber),
    );

    // Filter unique contacts not in the database
    const uniqueContactsData = validContactData.filter(
      (contact: any) => !existingPhoneNumbers.has(contact["Phone Number"]),
    );

    if (!uniqueContactsData.length)
      return errorResponse(
        event,
        400,
        "No unique phone numbers found to insert",
      );

    // Construct the contacts data
    const contactsData = mapUniqueContacts(uniqueContactsData, organizationId);

    await addMultipleContacts(
      organizationId,
      contactsData,
      ContactSource.EXCEL,
    );

    return { status: true };
  } catch (error: any) {
    logger.error(`Contacts import error: ${JSON.stringify(error?.message)}`);
    return errorResponse(event, 500, error?.message);
  }
});
