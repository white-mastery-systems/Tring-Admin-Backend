const db = useDrizzle();

// chat contacts bucket
export const createContactList = async (contactList: InsertContactList) => {
  return (
    await db.insert(contactListSchema).values(contactList).returning()
  )[0];
};

export const getContactLists = async (organizationId: string, query?: any) => {
  const data = await db.query.contactListSchema.findMany({
    where: and(
      eq(contactListSchema.organizationId, organizationId),
      query?.q ? ilike(contactListSchema.name, `%${query?.q}%`) : undefined,
    ),
    orderBy: [desc(contactListSchema.createdAt)],
  });
  return data;
};

export const checkBucketNameExists = async (
  organizationId: string,
  bucketName: string,
  type: string,
  contactListId?: string,
) => {
  const conditions = [
    eq(contactListSchema.organizationId, organizationId),
    eq(contactListSchema.type, type),
    ilike(contactListSchema.name, bucketName),
  ];

  // Exclude the specific bucket ID if provided
  if (contactListId) {
    conditions.push(ne(contactListSchema.id, contactListId));
  }

  return await db.query.contactListSchema.findFirst({
    where: and(...conditions),
  });
};

export const getContactListById = async (id: string) => {
  const data = await db.query.contactListSchema.findFirst({
    where: eq(contactListSchema.id, id),
  });
  return data;
};

export const updateContactList = async (
  id: string,
  contactList: InsertContactList,
) => {
  return (
    await db
      .update(contactListSchema)
      .set({
        ...contactList,
        updatedAt: new Date(),
      })
      .where(eq(contactListSchema.id, id))
      .returning()
  )[0];
};

export const deleteContactList = async (id: string) => {
  return (
    await db
      .delete(contactListSchema)
      .where(eq(contactListSchema.id, id))
      .returning()
  )[0];
};

export const findExistingChatContactsLink = async (bucketId: string) => {
  return await db
    .select({ contactId: contactListContactsSchema.contactId })
    .from(contactListContactsSchema)
    .where(eq(contactListContactsSchema.contactListId, bucketId));
};

export const createChatContactBucketLink = async (contactsData: any) => {
  return (
    await db.insert(contactListContactsSchema).values(contactsData).returning()
  )[0];
};

// voicebot contacts buckets
export const createVoiceContactBucketLink = async (contactsData: any) => {
  return (
    await db.insert(voiceContactLinkSchema).values(contactsData).returning()
  )[0];
};

export const findExistingVoiceContactsLink = async (bucketId: string) => {
  return await db
    .select({ contactId: voiceContactLinkSchema.contactId })
    .from(voiceContactLinkSchema)
    .where(eq(voiceContactLinkSchema.contactListId, bucketId));
};

// Chat contacts link
export const getAllChatContactLink = async (organizationId: string) => {
  return await db.query.contactListContactsSchema.findMany({
    with: {
      contacts: true,
    },
    where: eq(contactListContactsSchema.organizationId, organizationId),
  });
};

export const getContactsByChatBucketId = async (contactListId: string, query?: any) => {
  let data = await db.query.contactListContactsSchema.findMany({
    with: {
      contacts: {
        where: query.q ?
        or(
          ilike(contactSchema.firstName, `%${query.q}%`),
          ilike(contactSchema.lastName, `%${query.q}%`),  
          ilike(contactSchema.email, `%${query.q}%`),
          ilike(contactSchema.phone, `%${query.q}%`)
        )
        : undefined, 
      },
      bucket: {
        columns: {
          name: true,
        },
      },
    },
    where: eq(contactListContactsSchema.contactListId, contactListId),
  });

  data = data.filter((i) => i.contacts !== null)
  return data;
};

// Voice contact link
export const getAllVoiceContactLink = async (organizationId: string) => {
  return await db.query.voiceContactLinkSchema.findMany({
    with: {
      contacts: true,
    },
    where: eq(voiceContactLinkSchema.organizationId, organizationId),
  });
};

export const getContactsByVoiceBucketId = async (contactListId: string, query?: any) => {
  let data = await db.query.voiceContactLinkSchema.findMany({
    with: {
      contacts: {
        where: query?.q ?  or(
        ilike(voicebotContactSchema.name, `%${query.q}%`),
        ilike(voicebotContactSchema.phone, `%${query.q}%`),
      )
      : undefined
      },
      bucket: {
        columns: {
          name: true,
        },
      },
    },
    where: eq(voiceContactLinkSchema.contactListId, contactListId),
  });

  data = data.filter((i) => i.contacts !== null)

  return data;
};

export const getContactsByChatbotBucketId = async (contactListId: string) => {
  return await db.query.contactListContactsSchema.findMany({
    with: {
      contacts: true,
    },
    where: eq(contactListContactsSchema.contactListId, contactListId),
  });
};

// delete contact link with bucket
export const deleteChatContactFromBucket = async (
  bucketId: string,
  contactId: string,
) => {
  return (
    await db
      .delete(contactListContactsSchema)
      .where(
        and(
          eq(contactListContactsSchema.contactListId, bucketId),
          eq(contactListContactsSchema.contactId, contactId),
        ),
      )
      .returning()
  )[0];
};

export const deleteVoiceContactFromBucket = async (
  bucketId: string,
  contactId: string,
) => {
  return (
    await db
      .delete(voiceContactLinkSchema)
      .where(
        and(
          eq(voiceContactLinkSchema.contactListId, bucketId),
          eq(voiceContactLinkSchema.contactId, contactId),
        ),
      )
      .returning()
  )[0];
};

// check chat contact link with bucket
export const getSingleChatContactLink = async (
  bucketId: string,
  contactId: string,
) => {
  return await db.query.contactListContactsSchema.findFirst({
    where: and(
      eq(contactListContactsSchema.contactId, contactId),
      eq(contactListContactsSchema.contactListId, bucketId),
    ),
  });
};

export const getSingleVoiceContactLink = async (
  bucketId: string,
  contactId: string,
) => {
  return await db.query.voiceContactLinkSchema.findFirst({
    where: and(
      eq(voiceContactLinkSchema.contactId, contactId),
      eq(voiceContactLinkSchema.contactListId, bucketId),
    ),
  });
};
