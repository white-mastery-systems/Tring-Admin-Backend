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
    .transform((val) => (val === "" ? null : val)) // Transform "" to null
    .nullable()
    .refine((val) => val === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email format",
    }),
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
  "Number": z.union([
    z.string().refine((val) => /^\+?\d+$/.test(val.trim()), {
      message: "Invalid phone number format",
    }),
    z.number().refine((val) => /^\+?\d+$/.test(val.toString().trim()), {
      message: "Invalid phone number format",
    }),
  ]),
}).refine(data => {
  const validPhoneLength = getPhoneLengthByCountry(data["Country Code"].toString())

  if (!validPhoneLength) {
    return false; // If country code is not found
  }

  const phoneNumber = typeof data["Number"] === "string" 
        ? data["Number"] 
        : data["Number"].toString();

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
}).refine(data => {
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

export const isChatContactsAlreadyExists = async(contactId: string, phone: string) => {
  return await db.query.contactSchema.findFirst({
    where: and(
      ne(contactSchema.id, contactId),
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

export const isVoicebotContactsAlreadyExists = async(contactId: string, phone: string) => {
  return await db.query.voicebotContactSchema.findFirst({
    where: and(
      ne(voicebotContactSchema.id, contactId),
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
        phone: i["Number"],
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
    let parsedData;
    if (fileType === "csv") {
      parsedData = await parseCSV(file.toString());
    } else if (fileType === "xlsx" || fileType === "xls") {
      parsedData = parseExcelBuffer(file);
    } else {
      throw new Error("Unsupported file format");
    }

    if (!parsedData || !parsedData.length) throw new Error("The uploaded file is empty");

    // Validate parsed data using Zod schema
    const validationResult = queryType === "chat"
      ? chatContactsArraySchema.safeParse(parsedData)
      : voiceContactsArraySchema.safeParse(parsedData);

    if (!validationResult.success) throw new Error("Validation errors in the imported file");

    const validContactData = validationResult.data.map((contact: any) => {
      if (queryType === "chat") {
        return {
          ...contact,
          Number: contact.Number ? String(contact.Number) : null, // Convert Number to string
        };
      } else {
        return {
          ...contact,
          Phone: contact.Phone ? String(contact.Phone) : null, // Convert Phone to string
        };
      }
    });

    return validContactData;
  } catch (error: any) {
    logger.error(`Contacts import function error: ${JSON.stringify(error?.message)}`);
    throw new Error(error);
  }
}
