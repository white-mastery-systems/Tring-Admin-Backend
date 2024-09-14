import { InsertNumberIntegration } from "~/server/schema/admin";

const db = useDrizzle();

export const createNumberIntegration = async (numberIntegration: InsertNumberIntegration) => {
  console.log({ numberIntegration})
  return (
    await db.insert(numberIntegrationSchema).values(numberIntegration)
    .returning()
  )[0];
}

export const listNumberIntegration = async (organizationId: string, query: any) => {
   let page, offset, limit = 0
    
  if(query.page && query.limit) {
    page = parseInt(query.page) 
    limit = parseInt(query.limit)
    offset = (page - 1) * limit;
  }
  const data = await db.query.numberIntegrationSchema.findMany({
    where: eq(numberIntegrationSchema.organizationId, organizationId)
  })

  if(query?.page && query?.limit) {
    const paginatedNumberIntegration = data.slice(offset, offset + limit); 
    return {
      calls: "Number Integration",
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length/ limit) || 1,
      totalCount: data.length,
      data: paginatedNumberIntegration
    }
  } else {
      return data
  }
}

export const getNumberIntegrationById = async (numberIntegrationId: string) => {
  const data = await db.query.numberIntegrationSchema.findFirst({
    where: eq(numberIntegrationSchema.id, numberIntegrationId)
  })

  return data;
}

export const updateNumberIntegration = async (id: string, numberIntegration: InsertNumberIntegration) => {
  return (
    await db.update(numberIntegrationSchema)
    .set({
      ...numberIntegration,
      updatedAt: new Date()
    })
    .where(eq(numberIntegrationSchema.id, id))
    .returning()
  )[0]
}

export const deleteNumberIntegration = async (id: string) => {
  return (
    await db.delete(numberIntegrationSchema)
    .where(eq(numberIntegrationSchema.id, id))
    .returning()
  )[0]
}