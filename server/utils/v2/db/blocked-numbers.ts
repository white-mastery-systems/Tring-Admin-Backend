const db = useDrizzle()

export const createBlockedNumber = async (data: any) => { 
  return (await db.insert(blockedNumbersSchema).values(data).returning())[0]
}

export const getBlockedNumbers = async (organizationId: string, query?: any) => {
  let page, offset, limit = 0;
  
  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  let data = await db.query.blockedNumbersSchema.findMany({
    where: eq(blockedNumbersSchema.organizationId, organizationId),
    orderBy: desc(blockedNumbersSchema.createdAt),
  })

  if (query?.page && query?.limit) {
    const paginatedBlockNumbers = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedBlockNumbers,
    };
  } else {
    return data;
  }
}

export const checkIfBlockedNumberExists = async (organizationId: string, phoneNumber: string, mode: string, id?: string) => {  
  return db.query.blockedNumbersSchema.findFirst({
    where: and(
      eq(blockedNumbersSchema.organizationId, organizationId),
      eq(blockedNumbersSchema.phoneNumber, phoneNumber),
      mode === "update" ? ne(blockedNumbersSchema.id, id) : undefined
    ),
  })
}

export const getBlockedNumberById = async (id: string) => {
  return db.query.blockedNumbersSchema.findFirst({
    where: eq(blockedNumbersSchema.id, id),
  })
}

export const updateBlockedNumberById = async(id: string, data: any) => {
  return (await db.update(blockedNumbersSchema)
  .set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(blockedNumbersSchema.id, id))
  .returning())[0]   
}

export const deleteBlockedNumberById = async (id: string) => {
  return (await db.delete(blockedNumbersSchema).where(eq(blockedNumbersSchema.id, id)).returning())[0]
} 