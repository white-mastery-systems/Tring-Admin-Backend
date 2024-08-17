const db = useDrizzle();

interface QueryInterface {
  q?: string;
}
export const listLeads = async (
  organizationId: string,
  query: QueryInterface,
) => {
  let filters: any = [eq(leadSchema.organizationId, organizationId)];
  if (query?.q) {
    // filters.push(like(botUserSchema.name, `%${query.q}%`));
    // const data = await db
    //   .select()
    //   .from(leadSchema)
    //   .rightJoin(botUserSchema, and(eq(botUserSchema.id, leadSchema.botUserId)))
    //   .where(
    //     and(
    //       eq(leadSchema.organizationId, organizationId),
    //       like(botUserSchema.name, `%${query.q}%`),
    //     ),
    //   );
    // .where(like(botUserSchema.name, `%${query.q}%`))
  }

  const leads = await db.query.leadSchema.findMany({
    where: and(...filters),
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
    // joins: {
    //   botUserId: true, // Perform a join with the botUser schema
    // },
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
