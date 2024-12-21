const db = useDrizzle();

// chat contacts bucket
export const createContactList = async (contactList: InsertContactList) => {
  return (await db.insert(contactListSchema).values(contactList).returning())[0];
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

export const isBucketNameAlreadyExists = async (organizationId: string, bucketName: string, type: string) => {
  return await db.query.contactListSchema.findFirst({
      where: and(
         eq(contactListSchema.organizationId, organizationId),
         eq(contactListSchema.type, type),
         ilike(contactListSchema.name, bucketName)
      )
   })
}

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
  return await db.select({ contactId: contactListContactsSchema.contactId })
   .from(contactListContactsSchema)
   .where(eq(contactListContactsSchema.contactListId, bucketId)
  );
}

export const createChatContactBucketLink = async (contactsData: any) => {
  return (
    await db.insert(contactListContactsSchema).values(contactsData).returning()
  )[0]
}


// voicebot contacts buckets
export const createVoiceContactBucketLink = async (contactsData: any) => {
  return (
    await db.insert(voiceContactLinkSchema).values(contactsData).returning()
  )[0]
}

export const findExistingVoiceContactsLink = async (bucketId: string) => {
  return await db.select({ contactId: voiceContactLinkSchema.contactId })
   .from(voiceContactLinkSchema)
   .where(eq(voiceContactLinkSchema.contactListId, bucketId)
  );
}
