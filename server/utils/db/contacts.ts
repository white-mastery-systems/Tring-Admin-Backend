import { inArray } from "drizzle-orm";
import { InsertVoicebotContacts } from "~/server/schema/admin";
import { logger } from "~/server/logger"
import { z } from "zod";
import { getPhoneLengthByCountry } from "../phonenumberLength";

const db = useDrizzle();

// Define the Zod schema for a single contact
const zodChatImportContacts = z.object({
  "First Name": z.string().min(1, "First Name is required"),
  "Last Name": z.string().optional(),
  "Email": z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => {
        // If value is null, undefined, or empty string, consider it valid
        if (value === null || value === undefined || value.trim() === '') {
          return true;
        }
        
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      },
      { message: "Invalid email format" }
    ),
  "Country Code": z.union([
    z.string()
      .refine((val) => /^\d+$/.test(val), { // Validate only digits
        message: "Invalid country code format",
      }),
    z.number()
      .refine((val) => /^\d+$/.test(val), { // Validate only digits
        message: "Invalid country code format",
      })
  ]),
  "Phone": z.union([
    z.string().refine((val) => /^\+?\d+$/.test(val.trim()), {
      message: "Invalid phone number format",
    }),
    z.number().refine((val) => /^\+?\d+$/.test(val.toString().trim()), {
      message: "Invalid phone number format",
    }),
  ]),
}).passthrough()
.refine(data => {
  const validPhoneLength = getPhoneLengthByCountry(data["Country Code"].toString())

  if (!validPhoneLength) {
    return false; // If country code is not found
  }

  const phoneNumber = typeof data["Phone"] === "string" 
        ? data["Phone"] 
        : data["Phone"].toString();

  const cleanedPhone = phoneNumber.replace(/[^\d]/g, "").length;
  
  if (Array.isArray(validPhoneLength)) {
    return validPhoneLength.includes(cleanedPhone); // Check for multiple valid lengths
  }

  return cleanedPhone === validPhoneLength; 
},{
  message: "Phone number length is invalid for the given country code.",
  path: ['phoneNumber'], // Add path to which the error is related
});

const zodVoiceImportsContacts = z.object({
  "Name": z.string().min(1, "Name is required"),
  "Phone": z.union([
    z.string().refine((val) => /^\+?\d+$/.test(val.trim()), {
      message: "Invalid phone number format",
    }),
    z.number().refine((val) => /^\+?\d+$/.test(val.toString().trim()), {
      message: "Invalid phone number format",
    }),
  ]),
  "Country Code": z.union([
    z.string()
      .refine((val) => /^\d+$/.test(val), { // Validate only digits
        message: "Invalid country code format",
      }),
    z.number()
      .refine((val) => /^\d+$/.test(val), { // Validate only digits
        message: "Invalid country code format",
      })
  ]),
  "Metadata": z.string().optional(),
  "Verification Id": z.string().optional(),
}).passthrough()
.refine(data => {
  const validPhoneLength = getPhoneLengthByCountry(data["Country Code"].toString())
  if (!validPhoneLength) {
    return false; // If country code is not found
  }

  const phoneNumber = typeof data["Phone"] === "string" 
        ? data["Phone"] 
        : data["Phone"].toString();

  const cleanedPhone = phoneNumber.replace(/[^\d]/g, "").length;
  
  if (Array.isArray(validPhoneLength)) {
    return validPhoneLength.includes(cleanedPhone); // Check for multiple valid lengths
  }

  return cleanedPhone === validPhoneLength; 
},{
  message: "Phone number length is invalid for the given country code.",
  path: ['phoneNumber'], // Add path to which the error is related
});


// Define a schema for an array of contacts
const chatContactsArraySchema = z.array(zodChatImportContacts);
const voiceContactsArraySchema = z.array(zodVoiceImportsContacts)

export const createContacts = async (contacts: any) => {
  return (await db.insert(contactSchema).values(contacts).returning())[0];
};

export const getContacts = async (
  organizationId: string,
  query?: any,
) => {
  let page,
    offset,
    limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  const data = await db.query.contactSchema.findMany({
    where: and(
      eq(contactSchema.organizationId, organizationId),
      query?.q ? or(
        ilike(contactSchema.firstName, `%${query.q}%`),
        ilike(contactSchema.lastName, `%${query.q}%`), 
        ilike(contactSchema.email, `%${query.q}%`),
        ilike(contactSchema.phone, `%${query.q}%`),
      )
      : undefined,
    ),

    orderBy: [desc(contactSchema.createdAt)],
  });
  if (query?.page && query?.limit) {
    const paginatedContacts = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedContacts,
    };
  } else {
    return data;
  }
};

export const getContactsById = async (id: string) => {
  const data = await db.query.contactSchema.findFirst({
    where: eq(contactSchema.id, id),
  });
  return data;
};

export const updateContacts = async (id: string, contacts: InsertContacts) => {
  return (
    await db
      .update(contactSchema)
      .set({
        ...contacts,
        updatedAt: new Date(),
      })
      .where(eq(contactSchema.id, id))
      .returning()
  )[0];
};

export const deleteContacts = async (id: string) => {
  return (
    await db.delete(contactSchema).where(eq(contactSchema.id, id)).returning()
  )[0];
};

export const isChatContactsAlreadyExists = async(organizationId: string, contactId: string, phone: string) => {
  return await db.query.contactSchema.findFirst({
    where: and(
      ne(contactSchema.id, contactId),
      eq(contactSchema.organizationId, organizationId),
      eq(contactSchema.phone, phone)
    )
  })
}

export const checkChatContacts = async (organizationId: string, phone: string) => {
  return await db.query.contactSchema.findFirst({
    where: and(
      eq(contactSchema.phone, phone),
      eq(contactSchema.organizationId, organizationId)
    )
  }) 
}

export const filterChatContactsByPhone = async (organizationId: string, phoneNumbers: any) => {
  return await db.select({ id: contactSchema.id, phone: contactSchema.phone })
    .from(contactSchema)
    .where(
      and(
      inArray(contactSchema.phone, phoneNumbers),
      eq(contactSchema.organizationId, organizationId)
    ))
}

// Voicebot contacts
export const checkVoiceContacts = async (organizationId: string, phone: string) => {
  return await db.query.voicebotContactSchema.findFirst({
    where: and(
      eq(voicebotContactSchema.phone, phone),
      eq(voicebotContactSchema.organizationId, organizationId)
    )
  }) 
}

export const createVoicebotContacts = async (voiceContact: any) => {
  return (
    await db.insert(voicebotContactSchema).values(voiceContact).returning()
  )[0]
}

export const getVoicebotContacts = async (
  organizationId: string,
  query?: any,
) => {
  let page, offset, limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  const data = await db.query.voicebotContactSchema.findMany({
    where: and(
      eq(voicebotContactSchema.organizationId, organizationId),
      query?.q ?
      or(
        ilike(voicebotContactSchema.name, `%${query.q}%`),
        ilike(voicebotContactSchema.phone, `%${query.q}%`),
      )
      : undefined,
    ),
    orderBy: [desc(voicebotContactSchema.createdAt)],
  });
  if (query?.page && query?.limit) {
    const paginatedVoiceContacts = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedVoiceContacts,
    };
  } else {
    return data;
  }
};

export const getAllVoicebotContacts = async () => {
  return await db.query.voicebotContactSchema.findMany({})
}

export const getVoicebotContactsById = async (id: string) => {
  const data = await db.query.voicebotContactSchema.findFirst({
    where: eq(voicebotContactSchema.id, id),
  });
  return data;
};

export const updateVoicebotContacts = async (id: string, contacts: InsertVoicebotContacts) => {
  return (
    await db
      .update(voicebotContactSchema)
      .set({
        ...contacts,
        updatedAt: new Date(),
      })
      .where(eq(voicebotContactSchema.id, id))
      .returning()
  )[0];
};

export const deleteVoicebotContacts = async (id: string) => {
  return (
    await db.delete(voicebotContactSchema).where(eq(voicebotContactSchema.id, id)).returning()
  )[0];
};

export const isVoicebotContactsAlreadyExists = async(organizationId: string,contactId: string, phone: string) => {
  return await db.query.voicebotContactSchema.findFirst({
    where: and(
      ne(voicebotContactSchema.id, contactId),
      eq(voicebotContactSchema.organizationId, organizationId),
      eq(voicebotContactSchema.phone, phone)
    )
  })
}

export const filterVoiceContactsByPhone = async (organizationId: string, phoneNumbers: any) => {
  return await db.select({ id: voicebotContactSchema.id, phone: voicebotContactSchema.phone })
    .from(voicebotContactSchema)
    .where(
      and(
        inArray(voicebotContactSchema.phone, phoneNumbers),
        eq(voicebotContactSchema.organizationId, organizationId)
      )
    )
}

export const constructData = (uniqueContactsData: any, type: string, organizationId: string) => {
  return uniqueContactsData.map((i: any) => { 
    return type === "chat" ?
      {
        firstName: i["First Name"],
        lastName: i["Last Name"],
        email: i["Email"],
        countryCode: `+${i["Country Code"]}`,
        phone: i["Phone"],
        organizationId
      } 
    : 
      {
        name: i["Name"],
        phone: i["Phone"],
        countryCode: `+${i["Country Code"]}`,
        metadata: i["Metadata"],
        verificationId: i["Verification Id"],
        organizationId
      } 
    })
}


export const parseContactsFormDataFile = async ({ file, fileType, queryType } : {
    file: any,
    fileType: string,
    queryType: string
  }) => {
  try {
    const requiredFields = queryType === "chat" ? ["First Name", "Country Code", "Phone"] : ["Name", "Country Code", "Phone"]
   
    let parsedData;
    if (fileType === "csv") {
      parsedData = await parseCSV(file.toString(), requiredFields);
    } else if (fileType === "xlsx" || fileType === "xls") {
      parsedData = parseExcelBuffer(file, requiredFields);
    } else {
      throw new Error("Unsupported file format");
    }

    if (!parsedData || !parsedData.length) throw new Error("The uploaded file is empty");
    // return parsedData

    checkMissingColumnsFromData(parsedData, queryType);

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      for (const field of requiredFields) {
        if (!row[field] || String(row[field]).trim() === "") {
          throw new Error(`Row ${i + 2} is missing required field: ${field}` // +2 to account for header + 0-index
          );  
        }
      }
    }
   
    const apiResponse: any = handleBulkUpload(parsedData, queryType);
    // return apiResponse

    if (!apiResponse.success) {
      // Formatting errors for user display
      let errorDetails = '';
      const formattedErrors = apiResponse.errors?.map((rowError: any) => {
         errorDetails = rowError.errors.map((err: any) => 
          `${err.message}`
        ).join('; ');

        throw new Error(`Row ${rowError.rowIndex + 2}: ${errorDetails}`);
      });
      logger.error(`Validation error for imported file, ${JSON.stringify({
        apiResponse,
        formattedErrors,
        errorDetails
      })}`)
    }

    const validContactData = apiResponse?.validData.map((contact: any) => {
      return {
        ...contact,
        Phone: contact.Phone ? String(contact.Phone) : null, // Convert Phone to string
      };
    });

    
    if(queryType === "voice") {
      const transformedContacts = validContactData.map((contact: any) => {
      const { Name, ["Country Code"]: countryCode, Phone, ...rest } = contact;

      const metadata = Object.entries(rest)
      .filter(([key]) => key.startsWith("Metadata_"))
      .map(([_, value]) => value)
      .join(", "); // Only values

      return {
        ...contact,
        Metadata: JSON.stringify(metadata)
      };
    });
    return transformedContacts
    }

    

    return validContactData;
  } catch (error: any) {
    logger.error(`Contacts import function error: ${JSON.stringify(error?.message)}`);
    throw new Error(error);
  }
}

// Define error response interface
interface UserFriendlyError {
  rowIndex: number;
  errors: {
    field: string;
    message: string;
    value: any;
  }[];
}

function validateBulkData(data: unknown[], type: string) {
  const validationErrors: UserFriendlyError[] = [];
  const schema = type === "chat" ? zodChatImportContacts : zodVoiceImportsContacts;
  const validData: any = [];

  data.forEach((record, index) => {
    try {
      // Validate each record
      const validatedRecord = schema.parse(record);
      validData.push(validatedRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format user-friendly errors
        const rowErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.path.reduce((obj: any, key) => obj?.[key], record)
        }));

        validationErrors.push({
          rowIndex: index,
          errors: rowErrors
        });
      }
    }
  });

  return { validData, validationErrors };
}

// API Response Type
interface ApiResponse {
  success: boolean;
  message: string;
  validCount?: number;
  errorCount?: number;
  errors?: UserFriendlyError[];
  validData?: any[];
}

// Simulate API endpoint handler
function handleBulkUpload(uploadedData: unknown[], type: string): ApiResponse {
  const { validData, validationErrors } = validateBulkData(uploadedData, type);

  // No errors scenario
  if (validationErrors.length === 0) {
    return {
      success: true,
      message: `Successfully processed ${validData.length} records`,
      validCount: validData.length,
      validData
    };
  }

  // Errors scenario
  return {
    success: false,
    message: `Validation failed for ${validationErrors.length} records`,
    validCount: validData.length,
    errorCount: validationErrors.length,
    errors: validationErrors
  };
}

export function checkMissingColumnsFromData(
  data: Record<string, any>[],
  queryType: string
): void {
  const requiredFields =
    queryType === 'chat'
      ? ['First Name', 'Country Code', 'Phone']
      : ['Name', 'Country Code', 'Phone'];

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Uploaded file is empty or invalid');
  }

  // Get keys from the first row and normalize
  const actualColumns = Object.keys(data[0]).map(key => key.trim());

  const missingColumns = requiredFields.filter(
    field => !actualColumns.includes(field)
  );

  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }
}