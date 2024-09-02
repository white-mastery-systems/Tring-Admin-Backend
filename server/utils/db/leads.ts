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
    if(query?.status==="revisited"){
      filters.push(eq(leadSchema.status,"default"))
    }
    
   // Period-based filtering
    if (query?.period) {
      let fromDate: Date | undefined;
      let toDate: Date | undefined;
      const queryDate = getDateRangeForFilters(query)
      fromDate = queryDate?.from
      toDate = queryDate?.to
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
            query?.status === "new" ? lte(botUserSchema.visitedCount, 1) : undefined,
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

export const getDateRangeForFilters = (query: any) => {
      switch (query?.period) {
        case "today":
          return {
            from: startOfDay(new Date()),
            to: endOfDay(new Date())
          }
        case "this-week":
          return {
            from: startOfWeek(new Date()),
            to: endOfWeek(new Date())
          }
        case "this-month": 
          return {
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date())
          }
        case "this-year":
          return {
            from: startOfYear(new Date()),
            to: endOfYear(new Date())
          }
        case "6-months":
          return {
            from: startOfMonth(subMonths(new Date(), 6)),
            to: endOfMonth(new Date())
          }
        case "custom":
          return {
            from: query?.from || undefined,
            to: query?.to || undefined
          }
         case "all":
          return {
            from: undefined,
            to: undefined
          }
      }
};