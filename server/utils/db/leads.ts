import { InsertLead } from "~/server/schema/bot";
import { endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear, subDays, subMonths, subYears } from 'date-fns';

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
      };
    case "yesterday":
      return {
        from: startOfDay(subDays(new Date(), 1)),
        to: endOfDay(subDays(new Date(), 1))
      };
    case "last-7-days":
      return {
        from: startOfDay(subDays(new Date(), 7)),
        to: endOfDay(new Date())
      };
    case "last-30-days":
      return {
        from: startOfDay(subDays(new Date(), 30)),
        to: endOfDay(new Date())
      };
    case "current-month":
      return {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
      };
    case "last-month":
      return {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1))
      };
    case "current-year":
      return {
        from: startOfYear(new Date()),
        to: endOfYear(new Date())
      };
    case "last-year":
      return {
        from: startOfYear(subYears(new Date(), 1)),
        to: endOfYear(subYears(new Date(), 1))
      };
    case "current-financial-year":
      return {
        from: new Date(new Date().getFullYear(), 3, 1),  // April 1st of the current year
        to: new Date(new Date().getFullYear() + 1, 2, 31)  // March 31st of the next year
      };
    case "last-financial-year":
      return {
        from: new Date(new Date().getFullYear() - 1, 3, 1),  // April 1st of the last year
        to: new Date(new Date().getFullYear(), 2, 31)  // March 31st of the current year
      };
    case "custom":
      return {
        from: query?.from || undefined,
        to: query?.to || undefined
      };
    case "all-time":
      return {
        from: undefined,
        to: undefined
      };
    default:
      return {
        from: undefined,
        to: undefined
      };
  }
};

// export const getDateRangeForFilters = (query: any) => {
//       switch (query?.period) {
//         case "today":
//           return {
//             from: startOfDay(new Date()),
//             to: endOfDay(new Date())
//           }
//         case "this-week":
//           return {
//             from: startOfWeek(new Date()),
//             to: endOfWeek(new Date())
//           }
//         case "this-month": 
//           return {
//             from: startOfMonth(new Date()),
//             to: endOfMonth(new Date())
//           }
//         case "this-year":
//           return {
//             from: startOfYear(new Date()),
//             to: endOfYear(new Date())
//           }
//         case "6-months":
//           return {
//             from: startOfMonth(subMonths(new Date(), 6)),
//             to: endOfMonth(new Date())
//           }
//         case "custom":
//           return {
//             from: query?.from || undefined,
//             to: query?.to || undefined
//           }
//          case "all":
//           return {
//             from: undefined,
//             to: undefined
//           }
//       }
// };