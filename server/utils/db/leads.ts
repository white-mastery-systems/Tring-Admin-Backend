const db = useDrizzle();

export const listLeads = async (organizationId: string) => {
  const leads = await db.query.leadSchema.findMany({
    where: eq(leadSchema.organizationId, organizationId),
    with: {
      bot: {
        columns: {
          name: true,
        },
      },
      botUser: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: [desc(leadSchema.createdAt)],
  });

  return leads;
};

export const deleteLead = async (leadId: string) => {
  console.log(leadId, "leadId");
  return await db
    .delete(leadSchema)
    .where(eq(leadSchema.id, leadId))
    .returning();
};
