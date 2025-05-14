import { inArray } from "drizzle-orm";
import { z } from "zod";
import { logger } from "~/server/logger";
import { InsertContactProfile } from "~/server/schema/admin";

type SourceType = "crm" | "google" | "manual" | "excel";

export enum ContactSource {
  MANUAL = "manual",
  EXCEL = "excel",
  GOOGLE = "google",
  CRM = "crm",
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
      z.string().refine((val) => /^\d+$/.test(val), {
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
      const validPhoneLength = getPhoneLengthByCountry(
        data["Country Code"].toString(),
      );

      if (!validPhoneLength) {
        return false;
      }

      const phoneNumber =
        typeof data["Phone Number"] === "string"
          ? data["Phone Number"]
          : data["Phone Number"].toString();

      const cleanedPhone = phoneNumber.replace(/[^\d]/g, "").length;

      if (Array.isArray(validPhoneLength)) {
        return validPhoneLength.includes(cleanedPhone);
      }

      return cleanedPhone === validPhoneLength;
    },
    {
      message: "Phone number length is invalid for the given country code.",
      path: ["phoneNumber"],
    },
  );

// Define the contact schema
export const contactInfoSchema = z.object({
  name: z.string().min(1),
  countryCode: z.string().min(1).max(5),
  phoneNumber: z.string().min(5).max(20),
  email: z.string().email().optional(),
  metadata: z.string().optional(),
  verificationId: z.string().optional(),
  source: z.enum(["manual", "excel", "google", "crm"]),
  externalId: z.string().nullable().optional(),
});

export const contactQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().optional(),
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
  contactQueryParams: z.infer<typeof contactQuerySchema>,
) => {
  try {
    const parsedQuery = contactQuerySchema.parse(contactQueryParams);

    const calculatedOffset =
      typeof parsedQuery.offset === "number"
        ? parsedQuery.offset
        : (parsedQuery.page - 1) * parsedQuery.limit;

    const contacts = await db.query.contactProfileSchema.findMany({
      where: eq(contactProfileSchema.organizationId, organizationId),
      orderBy: [desc(contactProfileSchema.createdAt)],
      limit: parsedQuery.limit,
      offset: calculatedOffset,
    });

    logger.info(
      `Retrieved ${contacts.length} contacts for orgId: ${organizationId} (limit=${parsedQuery.limit}, offset=${calculatedOffset})`,
    );

    return contacts;
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

export const checkIfContactExists = async (
  organizationId: string,
  phoneNumber: string,
) => {
  try {
    const existingContact = await db.query.contactProfileSchema.findFirst({
      where: and(
        eq(contactProfileSchema.phoneNumber, phoneNumber),
        eq(contactProfileSchema.organizationId, organizationId),
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
    return {
      name: contactInfo["Name"],
      email: contactInfo["Email"],
      countryCode: `+${contactInfo["Country Code"]}`,
      phoneNumber: contactInfo["Phone Number"],
      organizationId,
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

    checkRequiredColumnsPresence(parsedContacts);

    for (let i = 0; i < parsedContacts.length; i++) {
      const currentContact = parsedContacts[i];
      for (const field of requiredFields) {
        if (
          !currentContact[field] ||
          String(currentContact[field]).trim() === ""
        ) {
          throw new Error(`File name: ${fileName} - Row ${i + 2} is missing required field: ${field}`);
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
    throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
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
