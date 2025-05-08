import { z } from "zod";
import { logger } from "~/server/logger";

const db = useDrizzle();

// Define the contact schema
export const contactInfoSchema = z.object({
  name: z.string().min(1),
  countryCode: z.string().min(1).max(5),
  phoneNumber: z.string().min(5).max(20),
  email: z.string().email().optional(),
  metadata: z.record(z.any()).optional(),
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
  organizationId: string,
  contact: z.infer<typeof contactInfoSchema>,
) => {
  try {
    const result = await db
      .insert(contactProfileSchema)
      .values({
        ...contact,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    logger.info(
      `Contact added: ${JSON.stringify(result)}, orgId: ${organizationId}`,
    );
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
