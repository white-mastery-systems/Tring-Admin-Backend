import csvParser from "csv-parser";
import { logger } from "~/server/logger"
import { Readable } from "stream";
import * as xlsx from "xlsx/xlsx.mjs";
import { inArray } from 'drizzle-orm'

const db = useDrizzle()

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const formData = await readMultipartFormData(event)
    
     if (!formData) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: "Invalid Data",
        }),
      );
    }
    // return formData
  
    // Find the file field from formData
    const fileField = formData.find((item) => item.name === 'file');
    
    if (!fileField) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: "No file uploaded",
        }),
      );
    }
  
    const { filename, data } = fileField;
  
    const ext = filename?.split('.').pop().toLowerCase();
  
    console.log({ ext })
   
    let parsedData
  
    if (ext === 'csv') {
      parsedData = await parseCSV(data.toString()); // Parse CSV from buffer
    } else if (ext === 'xlsx' || ext === 'xls') {
      parsedData = parseExcelBuffer(data); // Parse Excel from buffer
    } else {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: "Unsupported file format",
        }),
      );
    }

    // Check if parsedData is empty (no rows)
    if (!parsedData || parsedData.length === 0) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: "The uploaded file is empty",
        })
      );
    }

    const expectedColumns = ['First Name', 'Last Name', 'Email', 'Country Code', 'Number'];
    const actualColumns = Object.keys(parsedData[0])

    // return { actualColumns }

    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col))

    // return { extraColumns }
  
    if (missingColumns.length) {
      return sendError(
         event,
         createError({
           statusCode: 400,
           statusMessage: `Missing columns - ${missingColumns.join(', ')}`,
         })
       );
    }

    if(extraColumns.length) {
       return sendError(
         event,
         createError({
           statusCode: 400,
           statusMessage: `Extra columns - ${extraColumns.join(', ')}`,
         })
       );
    }

     // Extract phone numbers from parsedData
    const phoneNumbers = parsedData.map((i: any) => i["Number"]).filter(Boolean); // Ensure no empty numbers

    // Query the database to find existing phone numbers
    const existingContacts = await db.select()
      .from(contactSchema)
      .where(inArray(contactSchema.phone, phoneNumbers));

    const existingPhoneNumbers = new Set(existingContacts.map((contact: any) => contact.phone));

    // Filter out the parsed data with unique phone numbers not in the database
    const uniqueContactsData = parsedData.filter((contact: any) => !existingPhoneNumbers.has(contact["Number"]));

    if (!uniqueContactsData.length) {
      return { status: false, message: "No unique phonenumbers found to insert"}
    }
  
    const contactsData = uniqueContactsData.map((i: any) => { 
      return {
        firstName: i["First Name"],
        lastName: i["Last Name"],
        email: i["Email"],
        countryCode: i["Country Code"],
        phone: i["Number"],
        organizationId
      }
    })
  
    // return { contactsData }
  
    await db.insert(contactSchema).values(contactsData).returning()
  
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

export function parseExcelBuffer(buffer) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}