import { logger } from "~/server/logger"
import { parseContactsFormDataFile } from "~/server/utils/db/contacts";
import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async(event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string;

    const query = await isValidQueryHandler(event, z.object({ type: z.string() }));
  
    const formData = await readMultipartFormData(event);
    if (!formData) return errorResponse(event, 500, "Invalid Data");

    const fileField = formData.find((item) => item.name === "file");
    if (!fileField) return errorResponse(event, 500, "No file uploaded");

    const { filename, data }: any = fileField;
    const ext = filename?.split(".").pop().toLowerCase();

    const validContactData = await parseContactsFormDataFile({ file: data, fileType: ext, queryType: query.type })

    // Extract phone numbers
    const phoneNumbers = query.type === "chat"
      ? validContactData.map((i: any) => i["Number"]).filter(Boolean)
      : validContactData.map((i: any) => i["Phone"]).filter(Boolean);

    // Query the database to find existing phone numbers
    const existingContacts = query.type === "chat"
      ? await filterChatContactsByPhone(organizationId, phoneNumbers)
      : await filterVoiceContactsByPhone(organizationId, phoneNumbers)

    const existingPhoneNumbers = new Set(existingContacts.map((contact: any) => contact.phone));

    // Filter unique contacts not in the database
    const uniqueContactsData = query.type === "chat"
      ? validContactData.filter((contact: any) => !existingPhoneNumbers.has(contact["Number"]))
      : validContactData.filter((contact: any) => !existingPhoneNumbers.has(contact["Phone"]));

    if (!uniqueContactsData.length) return errorResponse(event, 400, "No unique phone numbers found to insert")
    
    // Construct the contacts data
    const contactsData = constructData(uniqueContactsData, query.type, organizationId);

    query.type === "chat" 
       ? await createContacts(contactsData)
       : await createVoicebotContacts(contactsData)
  
    return { status: true }
  } catch(error: any) {
    logger.error(`Contacts import error: ${JSON.stringify(error?.message)}`);
    return errorResponse(event, 500, "Unable to import the file");
  }
})
