const db = useDrizzle();

interface QueryInterface {
  q?: string;
  botId?: string;
  from?: Date | null;
  to?: Date | null;
}
export const listLeads = async (
  organizationId: string,
  query: QueryInterface,
) => {
  let filters: any = [eq(leadSchema.organizationId, organizationId)];

  if (query?.botId) {
    filters.push(eq(leadSchema.botId, query.botId));
  }

  if (query?.q) {
    filters.push(ilike(botUserSchema.name, `%${query.q}%`));
  }

  if (query?.from && query?.to) {
    filters.push(between(leadSchema.createdAt, query.from, query.to));
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
          email: true,
          mobile: true,
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
