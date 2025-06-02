const db = useDrizzle();

export const createNumberIntegration = async (
  numberIntegration: InsertNumberIntegration,
) => {
  return (
    await db
      .insert(numberIntegrationSchema)
      .values(numberIntegration)
      .returning()
  )[0];
};

export const getNumberIntegration = async (exophone: string, id?: string) => {
  return await db.query.numberIntegrationSchema.findFirst({
    where: !id ? eq(numberIntegrationSchema.exoPhone, exophone) 
    : and(
      eq(numberIntegrationSchema.exoPhone, exophone),
      ne(numberIntegrationSchema.id, id)
    )
  })
}

export const listNumberIntegration = async (
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
  const data = await db.query.numberIntegrationSchema.findMany({
    where: and(
      eq(numberIntegrationSchema.organizationId, organizationId),
      query?.integrationName ? ilike(numberIntegrationSchema.ivrIntegrationName, `%${query.integrationName}%`) : undefined
    ),
    orderBy: [desc(numberIntegrationSchema.createdAt)],
  });

  if (query?.page && query?.limit) {
    const paginatedNumberIntegration = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedNumberIntegration,
    };
  } else {
    return data;
  }
};

export const getNumberIntegrationById = async (numberIntegrationId: string) => {
  const data = await db.query.numberIntegrationSchema.findFirst({
    where: eq(numberIntegrationSchema.id, numberIntegrationId),
  });

  return data;
};

export const updateNumberIntegration = async (
  id: string,
  numberIntegration: InsertNumberIntegration,
) => {
  return (
    await db
      .update(numberIntegrationSchema)
      .set({
        ...numberIntegration,
        updatedAt: new Date(),
      })
      .where(eq(numberIntegrationSchema.id, id))
      .returning()
  )[0];
};

export const deleteNumberIntegration = async (id: string) => {
  return (
    await db
      .delete(numberIntegrationSchema)
      .where(eq(numberIntegrationSchema.id, id))
      .returning()
  )[0];
};

export const getAllExoPhones = async() => {
  return await db.query.numberIntegrationSchema.findMany({})
}

export const getExophoneByProvider = async(providerName: string, organizationId: string) => {
  return await db.query.numberIntegrationSchema.findFirst({
    where: and(
      eq(numberIntegrationSchema.provider, providerName),
      eq(numberIntegrationSchema.organizationId, organizationId)
    ) 
  })
}

export const getIvrIntegrationByName = async(ivrIntegrationName: string, organizationId: string) => {
   return await db.query.numberIntegrationSchema.findFirst({
    where: and(
      ilike(numberIntegrationSchema.ivrIntegrationName, ivrIntegrationName),
      eq(numberIntegrationSchema.organizationId, organizationId)
    ) 
  })
}

export const isIvrIntegrationNameAlreadyExistsForUpdate = async(id: string, ivrIntegrationName: string, organizationId: string) => {
   return await db.query.numberIntegrationSchema.findFirst({
    where: and(
      ilike(numberIntegrationSchema.ivrIntegrationName, ivrIntegrationName),
      eq(numberIntegrationSchema.organizationId, organizationId),
      ne(numberIntegrationSchema.id, id)
    ) 
  })
}