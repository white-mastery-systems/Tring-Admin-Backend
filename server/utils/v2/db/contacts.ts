import { inArray } from "drizzle-orm";
import { z } from "zod";
import { logger } from "~/server/logger";
import { InsertContactProfile } from "~/server/schema/admin";
import { count } from "drizzle-orm/sql";
import momentTz from "moment-timezone";

type SourceType = "crm" | "google" | "manual" | "excel";

export enum ContactSource {
  MANUAL = "manual",
  EXCEL = "excel",
  GOOGLE = "google",
  CRM = "crm",
  CHATBOT = "chatbot",
  VOICEBOT = "voicebot"
}

interface FriendlyValidationError {
  rowIndex: number;
  errors: {
    field: string;
    message: string;
    value: any;
  }[];
}

interface BulkUploadResponse {
  success: boolean;
  message: string;
  validCount?: number;
  errorCount?: number;
  errors?: FriendlyValidationError[];
  validData?: any[];
}

const db = useDrizzle();

export const importContactSchema = z
  .object({
    "Name": z.string().min(1, "Name is required"),
    "Email": z
      .string()
      .optional()
      .nullable()
      .refine(
        (value) => {
          if (value === null || value === undefined || value.trim() === "") {
            return true;
          }

          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value);
        },
        { message: "Invalid email format" },
      ),
    "Country Code": z.union([
      z.string().refine((val) => /^\+?\d+$/.test(val), {
        message: "Invalid country code format",
      }),
      z.number().refine((val) => /^\d+$/.test(val.toString()), {
        message: "Invalid country code format",
      }),
    ]),
    "Phone Number": z.union([
      z.string().refine((val) => /^\+?\d+$/.test(val.trim()), {
        message: "Invalid phone number format",
      }),
      z.number().refine((val) => /^\+?\d+$/.test(val.toString().trim()), {
        message: "Invalid phone number format",
      }),
    ]),
    "Metadata": z.string().optional(),
    "Verification Id": z.string().optional(),
  })
  .passthrough()
  .refine(
    (data) => {
      const rawCode = data["Country Code"].toString().replace(/^\+/, ""); // remove '+' if present
      const validPhoneLength = getPhoneLengthByCountry(rawCode);

      if (!validPhoneLength) {
        return false;
      }
  
      const phoneNumber = typeof data["Phone Number"] === "string"
        ? data["Phone Number"]
        : data["Phone Number"].toString();
  
      const cleanedPhone = phoneNumber.replace(/[^\d]/g, "").length;
  
      if (Array.isArray(validPhoneLength)) {
        return validPhoneLength.includes(cleanedPhone);
      }
  
      return cleanedPhone === validPhoneLength;
    },
    {
      message: "The Phonenumber length doesn't match the country code.",
      path: ["Phone Number"], // make sure the key matches your schema
    }
  )
  

// Define the contact schema
export const contactInfoSchema = z.object({
  name: z.string().min(1),
  countryCode: z.string().min(1).max(5),
  phoneNumber: z.string().min(5).max(20),
  email: z.string().email().optional(),
  metadata: z.string().optional(),
  verificationId: z.string().optional(),
  source: z.enum(["manual", "excel", "google", "crm", "chatbot", "voicebot"]),
  botId: z.string().optional(),
  externalId: z.string().nullable().optional(),
  organizationId: z.string().optional()
});

export const contactQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
  source: z.enum(["manual", "excel", "google", "crm", "all"]).optional(),
  botId: z.string().optional(),
  export: z.string().default("false"),
  period: z.string().optional(),
  from: z
      .string()
      .datetime({ offset: true })
      .nullish()
      .transform((val) => (val ? new Date(val) : null)),
    to: z
      .string()
      .datetime({ offset: true })
      .nullish()
      .transform((val) => (val ? new Date(val) : null)),
});

export const addContact = async (
  contacts: InsertContactProfile,
) => {
  try {
    const result = await db
      .insert(contactProfileSchema)
      .values(contacts)
      .returning();

    return result;
  } catch (error) {
    logger.error(
      `Failed to add contact: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};

export const getAllContacts = async (
  organizationId: string,
  contactQueryParams: any,
  timeZone: string
) => {
  try {
    // Period-based filtering
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (contactQueryParams?.period) {
      const queryDate = getDateRangeForFilters(contactQueryParams, timeZone);
      fromDate = queryDate?.from;
      toDate = queryDate?.to;
    }
    let page, offset, limit = 0;

    if (contactQueryParams?.page && contactQueryParams?.limit) {
      page = parseInt(contactQueryParams.page);
      limit = parseInt(contactQueryParams.limit);
      offset = (page - 1) * limit;
    }

    const whereClause = and(
      eq(contactProfileSchema.organizationId, organizationId),
      contactQueryParams?.period && fromDate && toDate
      ? between(contactProfileSchema.createdAt, fromDate, toDate)
      : undefined,
      contactQueryParams?.botId && contactQueryParams.botId !== "all"
        ? eq(contactProfileSchema.botId, contactQueryParams.botId)
        : undefined,
      contactQueryParams?.source && contactQueryParams.source !== "all"
        ? eq(contactProfileSchema.source, contactQueryParams.source as ContactSource)
        : undefined,
      contactQueryParams?.q ?
         or(
          ilike(contactProfileSchema.name, `%${contactQueryParams.q}%`),
          ilike(contactProfileSchema.phoneNumber, `%${contactQueryParams.q}%`)
         )
        : undefined,
    )

    const totalContactsQuery = db.select({ count: count() })
      .from(contactProfileSchema)
      .where(whereClause)

    const contactFilterQuery = db.select()
      .from(contactProfileSchema)
      .where(whereClause)
      .orderBy(desc(contactProfileSchema.createdAt))

    if (contactQueryParams?.export === "false") {
      contactFilterQuery.limit(limit).offset(offset);
    } 
   
    let [totalContactList,  filterContactList] = await Promise.all([
      totalContactsQuery,
      contactFilterQuery
    ])

    // Step 2: Group botIds by source
    const chatbotBotIds = new Set<string>();
    const voicebotBotIds = new Set<string>();
    
    for (const contact of filterContactList) {
      if (!contact.botId) continue;
      if (contact.source === 'chatbot') chatbotBotIds.add(contact.botId);
      if (contact.source === 'voicebot') voicebotBotIds.add(contact.botId);
    }
    
    // Step 3: Fetch bot names from respective tables
    const [chatbots, voicebots] = await Promise.all([
      db.query.chatBotSchema.findMany({
        where: inArray(chatBotSchema.id, Array.from(chatbotBotIds)),
        columns: { id: true, name: true },
      }),
      db.query.voicebotSchema.findMany({
        where: inArray(voicebotSchema.id, Array.from(voicebotBotIds)),
        columns: { id: true, name: true },
      }),
    ]);
    
    // Step 4: Build botId => name maps
    const chatbotMap = Object.fromEntries(chatbots.map((b: any) => [b.id, b.name]));
    const voicebotMap = Object.fromEntries(voicebots.map((b: any) => [b.id, b.name]));
    
    // Step 5: Attach bot name to each contact
    const contactsWithBotNames = filterContactList.map((contact: any) => {
      let botName: string | null = null;
    
      if (contact.botId) {
        if (contact.source === 'chatbot') {
          botName = chatbotMap[contact.botId] || null;
        } else if (contact.source === 'voicebot') {
          botName = voicebotMap[contact.botId] || null;
        }
      }
    
      return { 
        ...contact,
        createdAt: momentTz(contact.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
        botName,
      };
    })

    if (contactQueryParams?.export === "false") {
      const totalOrgContacts = totalContactList[0].count || 0
      return {
        page: page,
        limit: limit,
        totalPageCount: Math.ceil(totalOrgContacts / limit) || 1,
        totalCount: totalOrgContacts,
        data: contactsWithBotNames,
      };
    } else {
      return contactsWithBotNames;
    }
  } catch (error) {
    logger.error(
      `Failed to fetch contacts: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
};

export const getContactInformationById = async (
  organizationId: string,
  contactId: string,
) => {
  try {
    const contact = await db.query.contactProfileSchema.findFirst({
      where: and(
        eq(contactProfileSchema.id, contactId),
        eq(contactProfileSchema.organizationId, organizationId),
      ),
    });

    if (!contact) {
      logger.info(`Contact not found: ${contactId}`);
    }

    return contact;
  } catch (error) {
    logger.error(
      `Failed to fetch contact ${contactId}: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};

export const updateContactById = async (
  organizationId: string,
  contactId: string,
  contact: z.infer<typeof contactInfoSchema>,
) => {
  try {
    const result = await db
      .update(contactProfileSchema)
      .set({
        ...contact,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(contactProfileSchema.id, contactId),
          eq(contactProfileSchema.organizationId, organizationId),
        ),
      )
      .returning();

    if (result.length === 0) {
      logger.info(`No contact found to update: ${contactId}`);
    }

    return result;
  } catch (error) {
    logger.error(
      `Failed to update contact ${contactId}: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};

export const deleteContactById = async (
  organizationId: string,
  contactId: string,
) => {
  try {
    const result = await db
      .delete(contactProfileSchema)
      .where(
        and(
          eq(contactProfileSchema.id, contactId),
          eq(contactProfileSchema.organizationId, organizationId),
        ),
      )
      .returning();

    if (result.length > 0) {
      logger.info(`Contact deleted: ${contactId}, orgId: ${organizationId}`);
    }

    return result;
  } catch (error) {
    logger.error(
      `Failed to delete contact ${contactId}: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};

export const deleteBulkContactsByIds = async (contactIds: string[]) =>{
  await db.delete(contactProfileSchema).where(
    inArray(contactProfileSchema.id, contactIds)
  )
}

export const checkIfContactExists = async (
  organizationId: string,
  phoneNumber: string,
  mode: string,
  contactId?: string
) => {
  try {
    const existingContact = await db.query.contactProfileSchema.findFirst({
      where: and(
        eq(contactProfileSchema.phoneNumber, phoneNumber),
        eq(contactProfileSchema.organizationId, organizationId),
        (mode === "update" ? ne(contactProfileSchema.id, contactId) : undefined)
      ),
    });

    return existingContact;
  } catch (error) {
    logger.error(
      `Failed to check contact existence: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};

export const exportContacts = async (organizationId: string) => {
  try {
    const contacts = await db.query.contactProfileSchema.findMany({
      where: eq(contactProfileSchema.organizationId, organizationId),
      orderBy: [desc(contactProfileSchema.createdAt)],
    });

    logger.info(
      `Successfully exported ${contacts.length} contacts for organization: ${organizationId}`,
    );
    return contacts;
  } catch (error) {
    logger.error(
      `Failed to export contacts for organization ${organizationId}: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};

export const filterContactsByPhoneNumber = async (
  organizationId: string,
  phoneNumbers: any,
) => {
  return await db
    .select({
      id: contactProfileSchema.id,
      phoneNumber: contactProfileSchema.phoneNumber,
    })
    .from(contactProfileSchema)
    .where(
      and(
        inArray(contactProfileSchema.phoneNumber, phoneNumbers),
        eq(contactProfileSchema.organizationId, organizationId),
      ),
    );
};

export const mapUniqueContacts = (
  uniqueContactsData: any,
  organizationId: string,
) => {
  return uniqueContactsData.map((contactInfo: any) => {
    const rawCountryCode = contactInfo["Country Code"]?.toString().trim() || "";
    const formattedCountryCode = rawCountryCode.startsWith("+")
      ? rawCountryCode
      : `+${rawCountryCode}`;
    return {
      name: contactInfo["Name"],
      email: contactInfo["Email"],
      countryCode: formattedCountryCode,
      phoneNumber: contactInfo["Phone Number"],
      organizationId,
      metadata: contactInfo["Metadata"],
      verificationId:  contactInfo["Verification Id"]
    };
  });
};

export const parseContactImportFile = async (fileName: string, file: any, fileType: string) => {
  try {
    const requiredFields = ["Name", "Country Code", "Phone Number"];

    let parsedContacts;
    if (fileType === "csv") {
      parsedContacts = await parseCSV(file.toString(), requiredFields);
    } else if (fileType === "xlsx" || fileType === "xls") {
      parsedContacts = parseExcelBuffer(file, requiredFields);
    } else {
      throw new Error("Unsupported file format");
    }

    if (!parsedContacts?.length) throw new Error("The uploaded file is empty");

    checkRequiredColumnsPresence(fileName ,parsedContacts);

    for (let i = 0; i < parsedContacts.length; i++) {
      const currentContact = parsedContacts[i];
      for (const field of requiredFields) {
        if (
          !currentContact[field] ||
          String(currentContact[field]).trim() === ""
        ) {
          throw new Error(`File name: ${fileName} - Row ${i + 1} is missing required field: ${field}`);
        }
      }
    }

    const processedContactsResult: any = processBulkContacts(parsedContacts);

    if (!processedContactsResult.success) {
      let errorDetails = "";
      const formattedErrors = processedContactsResult.errors?.map(
        (rowError: any) => {
          errorDetails = rowError.errors
            .map((err: any) => `${err.message}`)
            .join("; ");

          throw new Error(`File name: ${fileName} - Row ${rowError.rowIndex + 2}: ${errorDetails}`);
        },
      );
      logger.error(
        `Validation error for imported file, ${JSON.stringify({
          apiResponse: processedContactsResult,
          formattedErrors,
          errorDetails,
        })}`,
      );
    }

    const validContactData = processedContactsResult?.validData.map(
      (contact: any) => {
        return {
          ...contact,
          "Phone Number": String(contact["Phone Number"]),
        };
      },
    );

    return validContactData
  } catch (error: any) {
    logger.error(
      `Contacts import function error: ${JSON.stringify(error?.message)}`,
    );
    throw new Error(error);
  }
};

export const checkRequiredColumnsPresence = (
  filename: string,
  contactRecords: Record<string, any>[],
) => {
  const requiredFields = ["Name", "Country Code", "Phone Number"];

  if (!Array.isArray(contactRecords) || contactRecords.length === 0) {
    throw new Error("Uploaded file is empty or invalid");
  }

  const actualColumns = Object.keys(contactRecords[0]).map((key) => key.trim());

  const missingColumns = requiredFields.filter(
    (field) => !actualColumns.includes(field),
  );

  if (missingColumns.length > 0) {
    throw new Error(`File name: ${filename} - Missing required columns: ${missingColumns.join(", ")}`);
  }
};

export const validateBulkContacts = (bulkContactData: unknown[]) => {
  const validationErrors: FriendlyValidationError[] = [];
  const schema = importContactSchema;
  const validData: any = [];

  bulkContactData.forEach((record, index) => {
    try {
      const validatedRecord = schema.parse(record);
      validData.push(validatedRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const rowErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          value: err.path.reduce((obj: any, key) => obj?.[key], record),
        }));

        validationErrors.push({
          rowIndex: index,
          errors: rowErrors,
        });
      }
    }
  });

  return { validData, validationErrors };
};

export const processBulkContacts = (uploadedData: any): BulkUploadResponse => {
  const { validData, validationErrors } = validateBulkContacts(uploadedData);

  if (validationErrors.length === 0) {
    return {
      success: true,
      message: `Successfully processed ${validData.length} records`,
      validCount: validData.length,
      validData,
    };
  }

  return {
    success: false,
    message: `Validation failed for ${validationErrors.length} records`,
    validCount: validData.length,
    errorCount: validationErrors.length,
    errors: validationErrors,
  };
};

export const getAllContactProfiles = async() => {
  return await db.query.contactProfileSchema.findMany({})
}