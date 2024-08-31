import { InsertLead } from "~/server/schema/bot";
import { endOfDay, endOfMonth, endOfWeek, endOfYear, startOfDay, startOfMonth, startOfWeek, startOfYear, subMonths } from 'date-fns';

const db = useDrizzle();

interface QueryInterface {
  q?: string;
  status?: string,
  channel?: string,
  period?: string,
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

    if(query?.status === "default" || query?.status === "junk") {
      filters.push(eq(leadSchema.status, query?.status))
    }
    
   // Period-based filtering
    if (query?.period) {
      let fromDate: Date | undefined;
      let toDate: Date | undefined;
      const now = new Date()

      switch (query.period) {
        case "today":
          fromDate = startOfDay(new Date());
          toDate = endOfDay(new Date());
          break;
        case "this-week":
          fromDate = startOfWeek(new Date());
          toDate = endOfWeek(new Date());
          break;
        case "this-month":
          fromDate = startOfMonth(new Date());
          toDate = endOfMonth(new Date());
          break;
        case "this-year":
          fromDate = startOfYear(new Date());
          toDate = endOfYear(new Date());
          break;
        case "6-months":
          fromDate = startOfMonth(subMonths(new Date(), 6));
          toDate = endOfMonth(new Date());
          break;
        case "custom":
          fromDate = query?.from || undefined;
          toDate = query?.to || undefined;
          break;
      }
      console.log({ fromDate, toDate})
      if (fromDate && toDate) {
        filters.push(between(leadSchema.createdAt, fromDate, toDate))
      }
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
          where: and (
            query?.q ? ilike(botUserSchema.name, query?.q) : undefined,
            query?.status === "new" ? eq(botUserSchema.visitedCount, 1) : undefined,
            query?.status === "revisited" ? gt(botUserSchema.visitedCount, 1) : undefined
          ),
        },
        chat: {
          where: query?.channel ? ilike(chatSchema.channel, query?.channel) : undefined,
        } 
      },

      orderBy: [desc(leadSchema.createdAt)],
    });
    if (query?.q || query?.status === "new" || query?.status === "revisited")
      leads = leads.filter((lead: any) => {
        return lead.botUser !== null;
      });
    if (query?.channel)
      leads = leads.filter((lead: any) => {
        return lead.chat !== null;
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

export const updateLead = async (leadId: string, lead: InsertLead) => {
  return (
    await db.update(leadSchema)
    .set(lead)
    .where(eq(leadSchema.id, leadId))
    .returning()
  )[0]
}