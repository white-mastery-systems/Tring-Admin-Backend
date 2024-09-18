import {
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { count, inArray } from "drizzle-orm";
import { InsertLead } from "~/server/schema/chatbot/leads.table";
import momentTz from "moment-timezone"

const db = useDrizzle();

interface QueryInterface {
  q?: string;
  status?: string;
  channel?: string;
  action?: string;
  period?: string;
  botId?: string;
  from?: Date | null;
  to?: Date | null;
  page?: string;
  limit?: string;
}
export const listLeads = async (
  organizationId: string,
  query: QueryInterface,
  timeZone: string,
) => {
  try {
    let filters: any = [eq(leadSchema.organizationId, organizationId)];

    if (query?.botId && query?.botId !== "all") {
      filters.push(eq(leadSchema.botId, query.botId));
    }

    let chatIds: any[] = [];

    if (query?.status && query?.status !== "all") {
      const intentsMap: Record<string, string> = {
        site_visit: "site_visit",
        virtual_tour: "virtual_tour",
        location: "location",
        schedule_call: "schedule_call",
      };

      if (intentsMap[query.status]) {
        chatIds = (
          await db.query.timelineSchema.findMany({
            where: and(
              eq(timelineSchema.orgId, organizationId),
              eq(timelineSchema.event, intentsMap[query.status]),
            ),
            columns: {
              chatId: true,
            },
          })
        ).map((i) => i.chatId);

        if (chatIds.length > 0) {
          filters.push(inArray(leadSchema.chatId, chatIds));
        } else {
          // If no chat IDs are found, return early to avoid unnecessary processing
          return [];
        }
      } else if (query?.status === "junk") {
        filters.push(ilike(leadSchema.status, query?.status));
      } else if (query?.status === "new" || query?.status === "revisited") {
        filters.push(eq(leadSchema.status, "default"));
      }
    }

    // Period-based filtering
    if (query?.period) {
      let fromDate: Date | undefined;
      let toDate: Date | undefined;
      const queryDate = getDateRangeForFilters(query);
      fromDate = queryDate?.from;
      toDate = queryDate?.to;

      if (fromDate && toDate) {
        filters.push(between(leadSchema.createdAt, fromDate, toDate));
      }
    }

    let page, offset, limit = 0
    
    if(query.page && query.limit) {
       page = parseInt(query.page) 
       limit = parseInt(query.limit)
       offset = (page - 1) * limit;
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
          where: and(
            query?.q ? ilike(botUserSchema.name, `%${query.q}%`) : undefined,
            query?.status === "new"
              ? lte(botUserSchema.visitedCount, 1)
              : undefined,
            query?.status === "revisited"
              ? gt(botUserSchema.visitedCount, 1)
              : undefined,
          ),
        },
        chat: {
          where: and(
            query?.channel && query.channel !== "all"
              ? ilike(chatSchema.channel, query?.channel)
              : undefined,
          ),
        },
      },
      orderBy: [desc(leadSchema.createdAt)],
    });

 
    leads = leads.map((i: any) => ({
        ...i,
        createdAt: momentTz(i.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A")
    }))
    if (query?.q || query?.status === "new" || query?.status === "revisited")
      leads = leads.filter((lead: any) => {
        return lead.botUser !== null;
      });
    if (query?.channel)
      leads = leads.filter((lead: any) => {
        return lead.chat !== null;
      });

      
    if(query?.page && query?.limit) {
      const paginatedLeads = leads.slice(offset, offset + limit);
      return {
        page: page,
        limit: limit,
        totalPageCount: Math.ceil(leads.length/limit) || 1,
        totalCount: leads.length,
        data: paginatedLeads
      }
    } else {
      return leads
    }
  } catch (err) {}
};

export const deleteLead = async (leadId: string) => {
  return await db
    .delete(leadSchema)
    .where(eq(leadSchema.id, leadId))
    .returning();
};

export const updateLead = async (leadId: string, lead: InsertLead) => {
  return (
    await db
      .update(leadSchema)
      .set({
        ...lead,
        updatedAt: new Date()
      })
      .where(eq(leadSchema.id, leadId))
      .returning()
  )[0];
};

export const getDateRangeForFilters = (query: any) => {
  switch (query?.period) {
    case "today":
      return {
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      };
    case "yesterday":
      return {
        from: startOfDay(subDays(new Date(), 1)),
        to: endOfDay(subDays(new Date(), 1)),
      };
    case "last-7-days":
      return {
        from: startOfDay(subDays(new Date(), 7)),
        to: endOfDay(new Date()),
      };
    case "last-30-days":
      return {
        from: startOfDay(subDays(new Date(), 30)),
        to: endOfDay(new Date()),
      };
    case "current-month":
      return {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      };
    case "last-month":
      return {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      };
    case "current-year":
      return {
        from: startOfYear(new Date()),
        to: endOfYear(new Date()),
      };
    case "last-year":
      return {
        from: startOfYear(subYears(new Date(), 1)),
        to: endOfYear(subYears(new Date(), 1)),
      };
    case "current-financial-year":
      return {
        from: new Date(new Date().getFullYear(), 3, 1), // April 1st of the current year
        to: new Date(new Date().getFullYear() + 1, 2, 31), // March 31st of the next year
      };
    case "last-financial-year":
      return {
        from: new Date(new Date().getFullYear() - 1, 3, 1), // April 1st of the last year
        to: new Date(new Date().getFullYear(), 2, 31), // March 31st of the current year
      };
    case "custom":
      return {
        from: query?.from || undefined,
        to: query?.to || undefined,
      };
    case "all-time":
      return {
        from: undefined,
        to: undefined,
      };
    default:
      return {
        from: undefined,
        to: undefined,
      };
  }
};
