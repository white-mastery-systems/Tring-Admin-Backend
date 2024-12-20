import { InsertVoicebotContacts } from "~/server/schema/admin";

const db = useDrizzle();

export const createContacts = async (contacts: InsertContacts) => {
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

// Voicebot contacts
export const checkVoiceContacts = async (organizationId: string, phone: string) => {
  return await db.query.voicebotContactSchema.findFirst({
    where: and(
      eq(voicebotContactSchema.phone, phone),
      eq(voicebotContactSchema.organizationId, organizationId)
    )
  }) 
}

export const createVoicebotContacts = async (voiceContact: InsertVoicebotContacts) => {
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