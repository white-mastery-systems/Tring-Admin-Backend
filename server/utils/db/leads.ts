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
  try {
    let filters: any = [eq(leadSchema.organizationId, organizationId)];

    if (query?.botId) {
      filters.push(eq(leadSchema.botId, query.botId));
    }

    if (query?.q) {
      // filters.push({
      //   botUser: ilike(botUserSchema.name, `%${query.q}%`),
      // });
      // filters.push(sql`${botUserSchema.name} ilike ${`%${query.q}%`}`);
    }

    if (query?.from && query?.to) {
      filters.push(between(leadSchema.createdAt, query.from, query.to));
    }

    let leads = await db.query.leadSchema.findMany({
      where: and(...filters),
      with: {
        bot: {
          columns: {
            name: true,
          },
        },
        botUser: {
          where: query?.q ? ilike(botUserSchema.name, query?.q) : undefined,
        },
      },

      orderBy: [desc(leadSchema.createdAt)],
    });
    if (query?.q)
      leads = leads.filter((lead) => {
        return lead.botUser !== null;
      });

    return leads;
  } catch (err) {
    console.log({ err });
  }
};

export const deleteLead = async (leadId: string) => {
  console.log(leadId, "leadId");
  return await db
    .delete(leadSchema)
    .where(eq(leadSchema.id, leadId))
    .returning();
};
