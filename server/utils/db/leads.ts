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
  outcome?: string;
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

      const queryDate = getDateRangeForFilters(query, timeZone);
      fromDate = queryDate?.from;
      toDate = queryDate?.to;

      if (fromDate && toDate) {
        filters.push(between(leadSchema.createdAt, fromDate, toDate));
      }
    }

    let page, offset, limit = 0;

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
        columns: {
          id: true,
          name: true,
          email: true,
          visitedCount: true,
        },
        with: {
          chats: {
             where: and(
            query?.channel && query.channel !== "all"
              ? ilike(chatSchema.channel, query?.channel)
              : undefined,
            query?.outcome && query?.outcome !== "all"
              ? eq(chatSchema.chatOutcome, query?.outcome)
              : undefined,
          ),
            columns: {
              id: true,
              metadata: true,
              mode: true,
              channel: true,
              visitedCount: true,
              chatOutcome: true,
              createdAt: true,
              updatedAt: true,
            },
            // sort chats normally
            orderBy: [desc(chatSchema.createdAt)],
            limit: 1, // only latest chat
            with: {
              messages: {
                orderBy: [desc(messageSchema.updatedAt)],
                limit: 1, // only latest message
              },
            },
          },
        },
      },
    },
    columns: {
      id: true,
      chatId: true,
      status: true,
      createdAt: true,
    },
    orderBy: [desc(leadSchema.createdAt)],
  });

  // return leads
  // -------------------------
  // Transform & paginate
  // -------------------------
  leads = (leads || [])
    // keep leads that have at least one chat
    .filter((lead: any) => Boolean(lead.botUser?.chats?.length))
    // sort by latest message.updatedAt (fallback: chat.updatedAt, fallback: lead.createdAt)
    .sort((a: any, b: any) => {
      const aChat = a.botUser.chats[0];
      const bChat = b.botUser.chats[0];
  
      const aMsgUpdated = aChat?.messages?.[0]?.updatedAt;
      const bMsgUpdated = bChat?.messages?.[0]?.updatedAt;
  
      const aActivity = aMsgUpdated ?? aChat?.updatedAt ?? a.createdAt;
      const bActivity = bMsgUpdated ?? bChat?.updatedAt ?? b.createdAt;
  
      return new Date(bActivity).getTime() - new Date(aActivity).getTime();
    })
    // flatten + clean result
    .map((lead: any) => {
      const latestChat = lead.botUser.chats[0];
  
      return {
        id: lead.id,
        chatId: lead.chatId,
        status: lead.status,
        createdAt: momentTz(lead.createdAt).tz(timeZone).format("DD MMM YYYY hh:mm A"),
        bot: {
          name: lead.bot?.name,
        },
        botUser: {
          id: lead.botUser.id,
          name: lead.botUser.name,
          email: lead.botUser.email,
          visitedCount: lead.botUser.visitedCount,
        },
        chat: {
          id: latestChat.id,
          metadata: latestChat.metadata,
          mode: latestChat.mode,
          channel: latestChat.channel,
          visitedCount: latestChat.visitedCount,
          chatOutcome: latestChat.chatOutcome,
          createdAt: latestChat.createdAt,
          updatedAt: latestChat.updatedAt,
        },
        updatedAt: momentTz(
          latestChat.messages?.[0]?.updatedAt || latestChat.updatedAt || lead.createdAt
        )
          .tz(timeZone)
          .format("DD MMM YYYY hh:mm A"),
      };
    });

  
  if (query?.q || query?.status === "new" || query?.status === "revisited") {
    leads = leads.filter((lead: any) => lead.botUser !== null);
  }
  
  if (query?.country && query?.country !== "all") {
    leads = leads.filter((i: any) => i.chat?.metadata?.country === query.country);
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
        from: momentTz(query?.from).tz(timeZone).startOf("day").toDate() || undefined,
        to: momentTz(query?.to).tz(timeZone).endOf("day").toDate() || undefined,
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
