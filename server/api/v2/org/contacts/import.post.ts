import { logger } from "~/server/logger";
import { errorResponse } from "~/server/response/error.response";
import {
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

    const fileFields = formData.filter((item) => item.name === "file");
    if (!fileFields.length) return errorResponse(event, 500, "No files uploaded");

    // return fileFields

    let allValidContacts: any[] = [];

    for (const fileField of fileFields) {
      const { filename, data: contactFormData }: any = fileField;
      const fileExtension = filename?.split(".").pop().toLowerCase();

      const validContactData = await parseContactImportFile(
        filename,
        contactFormData,
        fileExtension,
      );

      allValidContacts.push(...validContactData);
    }
    // return allValidContacts

    // Extract phone numbers
    const phoneNumbers = allValidContacts
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
    const uniqueContactsData = allValidContacts.filter(
      (contact: any) => !existingPhoneNumbers.has(contact["Phone Number"]),
    );
    // return uniqueContactsData
    if (!uniqueContactsData.length)
      return errorResponse(
        event,
        400,
        "No unique phone numbers found to insert",
      );

    // Construct the contacts data
    const contactsData = mapUniqueContacts(uniqueContactsData, organizationId);

    const mapContactsWithSource  = contactsData.map((contact: any) => ({
      ...contact,
      organizationId,
      source: ContactSource.EXCEL,
    }))

    await addContact(mapContactsWithSource)

    return { status: true };
  } catch (error: any) {
    logger.error(`Contacts import error: ${JSON.stringify(error?.message)}`);
    return errorResponse(event, 500, error?.message);
  }
});
