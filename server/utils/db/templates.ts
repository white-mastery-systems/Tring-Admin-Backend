import { InsertTemplates } from "~/server/schema/admin"
import momentTz from "moment-timezone"

const db = useDrizzle()

export const createTemplate = async(template: InsertTemplates) => {
  return (
    await db.insert(templateSchema).values(template).returning()
  )[0]
}

export const templateList = async (organizationId: string, query: any, timeZone: string) => {
   let page,
    offset,
    limit = 0;

  if (query?.page && query?.limit) {
    page = parseInt(query.page);
    limit = parseInt(query.limit);
    offset = (page - 1) * limit;
  }
  let data = await db.query.templateSchema.findMany({
    where: and(
      eq(templateSchema.organizationId, organizationId),
      query?.q ? ilike(templateSchema.name, `%${query?.q}%`) : undefined
     )
  })
  data = data.map((i: any) => ({
    ...i,
    createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
  }));
  if (query?.page && query?.limit) {
    const paginatedTemplates = data.slice(offset, offset + limit);
    return {
      page: page,
      limit: limit,
      totalPageCount: Math.ceil(data.length / limit) || 1,
      totalCount: data.length,
      data: paginatedTemplates,
    };
  } else {
    return data;
  }
}

export const getTemplateById = async(templateId: string) => {
  const data = await db.query.templateSchema.findFirst({
    where: eq(templateSchema.id, templateId)
  })
  return data
}

export const updateTemplateById = async(templateId: string, template: any) => {
  return (
    await db.update(templateSchema)
    .set({
      ...template,
      updatedAt: new Date()
    })
    .where(eq(templateSchema.id, templateId))
    .returning()
  )[0]
}

export const deleteTemplateById = async(templateId: string) => {
  return (
    await db.delete(templateSchema)
    .where(eq(templateSchema.id, templateId))
    .returning()
  )[0]
}