import { inArray } from "drizzle-orm";
import momentTz from "moment-timezone";

const db = useDrizzle();

interface QueryInterface {
  q?: string;
  status?: string;
  country?: string;
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
    // console.log({ query })
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
      const queryDate = getDateRangeForFilters(query, timeZone);
      fromDate = queryDate?.from;
      toDate = queryDate?.to;
      console.log("leads",{ fromDate, toDate })
      if (fromDate && toDate) {
        filters.push(between(leadSchema.createdAt, fromDate, toDate));
      }
    }

    let page,
      offset,
      limit = 0;

    if (query?.page && query?.limit) {
      page = parseInt(query.page);
      limit = parseInt(query.limit);
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
            query?.q ?
              or(
                ilike(botUserSchema.name, `%${query.q}%`),
                ilike(botUserSchema.email, `%${query.q}%`),
                ilike(botUserSchema.mobile, `%${query.q}%`),
              ) : undefined,
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
      createdAt: momentTz(i.createdAt)
        .tz(timeZone)
        .format("DD MMM YYYY hh:mm A"),
    }));
    if (query?.q || query?.status === "new" || query?.status === "revisited")
      leads = leads.filter((lead: any) => {
        return lead.botUser !== null;
      });
    if (query?.channel)
      leads = leads.filter((lead: any) => {
        return lead.chat !== null;
      });
    
    if(query?.country && query?.country !== "all") {
       leads = leads.filter((i: any) => i.chat?.metadata?.country === query.country)
     }

    if (query?.page && query?.limit) {
      const paginatedLeads = leads.slice(offset, offset + limit);
      return {
        page: page,
        limit: limit,
        totalPageCount: Math.ceil(leads.length / limit) || 1,
        totalCount: leads.length,
        data: paginatedLeads,
      };
    } else {
      return leads;
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
        updatedAt: new Date(),
      })
      .where(eq(leadSchema.id, leadId))
      .returning()
  )[0];
};

export const getDateRangeForFilters = (query: any, timeZone: string) => {
  const now = momentTz().tz(timeZone);
  switch (query?.period) {
    case "today":
      return {
        from: now.clone().startOf("day").toDate(),
        to: now.clone().endOf("day").toDate(),
      };
    case "yesterday":
      return {
        from: now.clone().subtract(1, 'day').startOf("day").toDate(),
        to: now.clone().subtract(1, 'day').endOf("day").toDate(),
      };
    case "last-7-days":
      return {
        from: now.clone().subtract(7, 'days').startOf("day").toDate(),
        to: now.clone().endOf("day").toDate(),
      };
    case "last-30-days":
      return {
        from: now.clone().subtract(30, 'days').startOf("day").toDate(),
        to: now.clone().endOf("day").toDate(),
      };
    case "current-month":
      return {
        from:  now.clone().startOf("month").toDate(),
        to: now.clone().endOf("month").toDate(),
      };
    case "last-month":
      return {
        from: now.clone().subtract(1, 'month').startOf("month").toDate(),
        to: now.clone().subtract(1, 'month').endOf("month").toDate(),
      };
    case "current-year":
      return {
        from: now.clone().startOf("year").toDate(),
        to: now.clone().endOf("year").toDate(),
      };
    case "last-year":
      return {
        from: now.clone().subtract(1, 'year').startOf("year").toDate(),
        to: now.clone().subtract(1, 'year').endOf("year").toDate(),
      };
    case "current-financial-year":
      return {
        from: momentTz(`${now.year()}-04-01`).tz(timeZone).toDate(), // April 1st of the current year
        to: momentTz(`${now.year() + 1}-03-31`).tz(timeZone).toDate(), // March 31st of the next year
      };
    case "last-financial-year":
      return {
        from: momentTz(`${now.year() - 1}-04-01`).tz(timeZone).toDate(), // April 1st of the last year
        to: momentTz(`${now.year()}-03-31`).tz(timeZone).toDate(), // March 31st of the current year
      };
    case "custom":
      return {
        from: momentTz(query?.from).tz(timeZone).toDate() || undefined,
        to: momentTz(query?.to).tz(timeZone).toDate() || undefined,
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
