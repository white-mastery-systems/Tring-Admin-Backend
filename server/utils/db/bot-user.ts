const db = useDrizzle()

export const getBotUserById = async (id: string, orgId: string) =>
  await db.query.botUserSchema.findFirst({
    where: and(
      eq(botUserSchema.id, id),
      eq(botUserSchema.organizationId, orgId),
    ),
  });


export const updateBotUser = async ( id: string, integrationData: any) => {
  await db.update(botUserSchema).set({
    metaData: integrationData,
    updatedAt: new Date()
  }).where (eq(botUserSchema.id, id))
}