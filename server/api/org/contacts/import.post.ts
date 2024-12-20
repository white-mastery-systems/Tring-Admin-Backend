import csvParser from "csv-parser";
import { logger } from "~/server/logger"
import { Readable } from "stream";
import * as xlsx from "xlsx/xlsx.mjs";
import { errorResponse } from "~/server/response/error.response";
import { filterChatContactsByPhone, filterVoiceContactsByPhone } from "~/server/utils/db/contacts";

// Define the Zod schema for a single contact
const zodChatImportContacts = z.object({
  "First Name": z.string().min(1, "First Name is required"),
  "Last Name": z.string().optional(),
  "Email": z.string().email("Invalid email format"),
  "Country Code": z.string().regex(/^\+?\d{1,4}$/, "Invalid country code format"),
  "Number": z.string().regex(/^\d{7,15}$/, "Invalid phone number format")
});

const zodVoiceImportsContacts = z.object({
  "Name": z.string().min(1, "Name is required"),
  "Phone": z.string(),
  "Metadata": z.string(),
  "Verification Id": z.string(),
});

// Define a schema for an array of contacts
const chatContactsArraySchema = z.array(zodChatImportContacts);
const voiceContactsArraySchema = z.array(zodVoiceImportsContacts)

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const query = await isValidQueryHandler(event, z.object({
      type: z.string()
    }))

    const formData = await readMultipartFormData(event)
    
    if (!formData) return errorResponse(event, 400, "Invalid Data")
  
    // Find the file field from formData
    const fileField = formData.find((item) => item.name === 'file');
    if (!fileField) return errorResponse(event, 400, "No file uploaded")
    const { filename, data } : any = fileField;
    const ext = filename?.split('.').pop().toLowerCase();

    let parsedData
    if (ext === 'csv') {
      parsedData = await parseCSV(data.toString()); // Parse CSV from buffer
    } else if (ext === 'xlsx' || ext === 'xls') {
      parsedData = parseExcelBuffer(data); // Parse Excel from buffer
    } else {
      return errorResponse(event, 400, "Unsupported file format")
    }

    // Check if parsedData is empty (no rows)
    if (!parsedData || parsedData.length === 0) return errorResponse(event, 400, "The uploaded file is empty")

    const expectedColumns = query.type === "chat" 
     ? ['First Name', 'Last Name', 'Email', 'Country Code', 'Number']
     : ['Name', 'Phone', 'Metadata', 'Verification Id'];
    
    const actualColumns = Object.keys(parsedData[0])

    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col))
  
    if (missingColumns.length) return errorResponse(event, 400, `Missing columns - ${missingColumns.join(', ')}`)
    if (extraColumns.length) return errorResponse(event, 400, `Extra columns - ${extraColumns.join(', ')}`)

     // Validate the parsed data with the Zod schema
    const validationResult = query.type === "chat" 
     ? chatContactsArraySchema.safeParse(parsedData)
     : voiceContactsArraySchema.safeParse(parsedData)

    if (!validationResult.success) return errorResponse(event, 400, "Validation errors in the imported file", validationResult)

    const validContactData = validationResult.data; 

    // Extract phone numbers from parsedData
    const phoneNumbers = query.type === "chat" 
      ? validContactData.map((i: any) => i["Number"]).filter(Boolean)
      : validContactData.map((i: any) => i["Phone"]).filter(Boolean) // Ensure no empty numbers

    // Query the database to find existing phone numbers
    const existingContacts = query.type === "chat" 
     ? await filterChatContactsByPhone(phoneNumbers)
     : await filterVoiceContactsByPhone(phoneNumbers)

    const existingPhoneNumbers = new Set(existingContacts.map((contact: any) => contact.phone));

    // Filter out the parsed data with unique phone numbers not in the database
    const uniqueContactsData = query.type === "chat" 
    ? validContactData.filter((contact: any) => !existingPhoneNumbers.has(contact["Number"]))
    : validContactData.filter((contact: any) => !existingPhoneNumbers.has(contact["Phone"]));

    if (!uniqueContactsData.length) return { status: false, message: "No unique phonenumbers found to insert"}
  
    const contactsData = constructData (uniqueContactsData, query.type, organizationId)

    query.type === "chat" 
     ? await createContacts(contactsData)
     : await createVoicebotContacts(contactsData)

    return { status: true }
  } catch (error: any) {
    logger.error(`Contacts import: ${JSON.stringify(error?.message)}`)
    return { status: false }
  }
})


export async function parseCSV(csvString: string) {
  const results: any = [];
  const stream = Readable.from(csvString);

  return new Promise((resolve, reject) => {
    stream
      .pipe(csvParser({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export function parseExcelBuffer(buffer: any) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

export const constructData = (uniqueContactsData: any, type: string, organizationId: string) => {
   uniqueContactsData.map((i: any) => { 
    return type === "chat" ?
      {
        firstName: i["First Name"],
        lastName: i["Last Name"],
        email: i["Email"],
        countryCode: i["Country Code"],
        phone: i["Number"],
        organizationId
      } 
    : 
      {
        name: i["Name"],
        phone: i["Phone"],
        metadata: i["Metadata"],
        verificationId: i["Verification Id"],
        organizationId
      } 
    })
}