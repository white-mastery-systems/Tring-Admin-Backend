const db = useDrizzle()

export const getBotUserById = async (id: string, orgId: string) =>
  await db.query.botUserSchema.findFirst({
    where: and(
      eq(botUserSchema.id, id),
      eq(botUserSchema.organizationId, orgId),
    ),
  });