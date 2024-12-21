import { inArray } from 'drizzle-orm'
import { logger } from "~/server/logger";
import { outboundCallSchema } from "~/server/schema/voicebot";
import { errorResponse } from "~/server/response/error.response";

const db = useDrizzle()

const zodOubtboundCallValidation = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string(),
  metadata: z.string(),
  verification_id: z.string(),
});

const outboundCallArraySchema = z.array(zodOubtboundCallValidation);

export default defineEventHandler(async (event) => {
  try {
    const organizationId = (await isOrganizationAdminHandler(event)) as string
    const formData = await readMultipartFormData(event)
      
    if (!formData) return errorResponse(event, 400, "Invalid Data")
  
    const fileField = formData.find((item) => item.name === 'file');
    const botId = formData.find(({ name }) => name === "botId")?.data.toString()!
    
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
  
    const expectedColumns = ['name', 'phone', 'metadata', 'verification_id'];
    const actualColumns = Object.keys(parsedData[0])

    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col))

    if (missingColumns.length) return errorResponse(event, 400, `Missing columns - ${missingColumns.join(', ')}`)
    if (extraColumns.length) return errorResponse(event, 400, `Extra columns - ${extraColumns.join(', ')}`)
     
    // Validate the parsed data with the Zod schema
    const validationResult = outboundCallArraySchema.safeParse(parsedData);

    if (!validationResult.success) return errorResponse(event, 400, "Validation errors in the imported file", validationResult)
   
    const validContactData = validationResult.data; 

    const phoneNumbers = validContactData.map((i: any) => i["phone"]).filter(Boolean); // Ensure no empty numbers
  
    // Query the database to find existing phone numbers
    const existingOutbound = await db.select()
      .from(outboundCallSchema)
      .where(inArray(outboundCallSchema.phone, phoneNumbers));

    const existingPhoneNumbers = new Set(existingOutbound.map((contact: any) => contact.phone));
  
    // Filter out the parsed data with unique phone_numbers not in the database
    const uniqueContactsData = validContactData.filter((contact: any) => !existingPhoneNumbers.has(contact["phone"]));
  
    if (!uniqueContactsData.length) return errorResponse(event, 400, "No unique phonenumbers found to insert")
    
    const outboundCallData = uniqueContactsData.map((i: any) => { 
      return {
        name: i["name"],
        phone: i["phone"],
        metadata: i["metadata"],
        verificationId: i["verification_id"],
        botId,
        organizationId
      }
    })

    await db.insert(outboundCallSchema).values(outboundCallData)
    return true

  } catch(error: any) {
    logger.error(`outboundCall import API Error: ${JSON.stringify(error.message)}`)
    return error
  }
})

