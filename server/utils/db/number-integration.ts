import { InsertNumberIntegration } from "~/server/schema/admin";

const db = useDrizzle();

export const createNumberIntegration = async (numberIntegration: InsertNumberIntegration) => {
  console.log({ numberIntegration})
  return (
    await db.insert(numberIntegrationSchema).values(numberIntegration)
    .returning()
  )[0];
}

export const listNumberIntegration = async (organizationId: string) => {
  const data = await db.query.numberIntegrationSchema.findMany({
    where: eq(numberIntegrationSchema.organizationId, organizationId)
  })

  return data;
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
    .set(numberIntegration)
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