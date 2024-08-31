import { count } from "drizzle-orm";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachHourOfInterval,
  format,
} from 'date-fns';

const db = useDrizzle();

export const createOrganization = async (organization: InsertOrganization) => {
  const newOrganization = await db
    .insert(organizationSchema)
    .values(organization)
    .returning();
  return newOrganization[0];
};

export const getOrganizationById = async (id: string) => {
  const organization = await db.query.organizationSchema.findFirst({
    where: eq(organizationSchema.id, id),
  });
  return organization;
};

export const updateOrganization = async (
  id: string,
  organization: Partial<InsertOrganization>,
) => {
  return await db
    .update(organizationSchema)
    .set(organization)
    .where(eq(organizationSchema.id, id));
};

// export const getAnalytics = async (
//   organizationId: string,
//   period = "this-month",
// ) => {
//   let fromDate = new Date();
//   let toDate = new Date();
//   toDate.setDate(toDate.getDate() + 1);
//   switch (period) {
//     case "today":
//       fromDate.setDate(fromDate.getDate() - 1);
//       break;
//     case "this-month":
//       fromDate.setMonth(fromDate.getMonth() - 1);
//       break;
//     case "last-month":
//       fromDate.setMonth(fromDate.getMonth() - 2);
//       break;
//     case "this-week":
//       fromDate.setDate(fromDate.getDate() - 7);
//       break;
//     case "6-months":
//       fromDate.setMonth(fromDate.getMonth() - 6);
//       break;
//     case "this-year":
//       fromDate.setFullYear(fromDate.getFullYear() - 1);
//       break;
//     default:
//       break;
//   }

//   const orgData = await db.query.organizationSchema.findFirst({
//     where: eq(organizationSchema.id, organizationId),
//     with: {
//       botUsers: {
//         where: and(
//           gte(botUserSchema.createdAt, fromDate),
//           lte(botUserSchema.createdAt, toDate),
//         ),
//       },
//       bots: {
//         where: and(
//           gte(chatBotSchema.createdAt, fromDate),
//           lte(chatBotSchema.createdAt, toDate),
//         ),
//         with: {
//           chats: true,
//         },
//       },
//       leads: {
//         where: and(
//           gte(leadSchema.createdAt, fromDate),
//           lte(leadSchema.createdAt, toDate),
//         ),
//       },
//     },
//   });
//   const interactedChats = await db
//     .select({ count: count() })
//     .from(chatSchema)
//     .where(
//       and(
//         gte(chatSchema.createdAt, fromDate),
//         lte(chatSchema.createdAt, toDate),
//         eq(chatSchema.interacted, true),
//         eq(chatSchema.organizationId, organizationId),
//       ),
//     );
//   const callScheduledTimeline = await db
//     .select({ count: count() })
//     .from(timelineSchema)
//     .where(
//       and(
//         gte(timelineSchema.createdAt, fromDate),
//         lte(timelineSchema.createdAt, toDate),
//         eq(timelineSchema.orgId, organizationId),
//         eq(timelineSchema.intent, "schedule_call"),
//       ),
//     );

//   const siteVisitTimeline = await db
//     .select({ count: count() })
//     .from(timelineSchema)
//     .where(
//       and(
//         gte(timelineSchema.createdAt, fromDate),
//         lte(timelineSchema.createdAt, toDate),
//         eq(timelineSchema.orgId, organizationId),
//         eq(timelineSchema.intent, "site_visit"),
//       ),
//     );
//   const locationTimeline = await db
//     .select({ count: count() })
//     .from(timelineSchema)
//     .where(
//       and(
//         gte(timelineSchema.createdAt, fromDate),
//         lte(timelineSchema.createdAt, toDate),
//         eq(timelineSchema.orgId, organizationId),
//         eq(timelineSchema.intent, "location"),
//       ),
//     );
//   const virtualTourTimeline = await db
//     .select({ count: count() })
//     .from(timelineSchema)
//     .where(
//       and(
//         gte(timelineSchema.createdAt, fromDate),
//         lte(timelineSchema.createdAt, toDate),
//         eq(timelineSchema.orgId, organizationId),
//         eq(timelineSchema.intent, "virtual_tour"),
//       ),
//     );

//   if (!orgData) return undefined;

//   const orgDataByMonth = await db.execute(sql`SELECT
//   TO_CHAR(created_at, 'Mon YYYY') AS MONTH,
//   COUNT(*) AS lead_count
// FROM
//   chatbot.bot
// WHERE
//   organization_id = ${organizationId}
// GROUP BY
//   organization_id,
//   TO_CHAR(created_at, 'Mon YYYY')
// ORDER BY
//   MONTH;
// `);

//   const leadsGraph =
//     await db.execute(sql`select to_char(l.created_at, 'Mon YYYY') as month, count(*) as count  from admin.organization as o
//       join chatbot.leads as l on l.organization_id = o.id
//       where o.id = ${organizationId}
//       GROUP BY to_char(l.created_at, 'Mon YYYY')`);

//   const sessionsGraph =
//     await db.execute(sql`select to_char(c.created_at, 'Mon YYYY') as month, count(*) as count  from admin.organization as o
//       join chatbot.bot as b on b.organization_id = o.id
//       join chatbot.chats as c on c.bot_id = b.id
//       where o.id = ${organizationId}
//       GROUP BY to_char(c.created_at, 'Mon YYYY')`);
//   const sessions = await db.query.analyticsSchema.findFirst({
//     where: eq(analyticsSchema.organizationId, organizationId),
//   });
//   return {
//     bots: orgData.bots.length,
//     chats: orgData.bots.reduce((acc, bot) => {
//       return acc + bot.chats.length;
//     }, 0),
//     users: orgData.botUsers.length,
//     leads: orgData.leads.length,
//     sessions: sessions?.sessions ?? 0,
//     virtualTourTimeline,
//     locationTimeline,
//     siteVisitTimeline,
//     callScheduledTimeline,
//     interactedChats,
//     graph: {
//       leads: leadsGraph.rows,
//       sessions: sessionsGraph.rows,
//     },
//   };
// };


export const getOrgUsage = async (organizationId: string) => {
  const org = await getOrganizationById(organizationId);

  if (!org) return undefined;

  return {
    used_quota: org.usedQuota,
    max_quota: org.maxQuota,
    plan_code: org.planCode,
    available_quota: org.maxQuota - org.usedQuota,
  };
};


// Date range generation function
const getAllDatesInRange = (period: string) => {
  let dates: string[] = [];
  let startDate: Date, endDate: Date;

  const now = new Date();

  switch (period) {
    case "this-week":
      startDate = startOfWeek(now, { weekStartsOn: 0 });
      endDate = endOfWeek(now, { weekStartsOn: 0 });
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(date => format(date, "yyyy-MM-dd"));
      break;

    case "this-month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(date => format(date, "yyyy-MM-dd"));
      break;

    case "this-year":
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(date => format(date, "yyyy-MM"));
      break;

    case "6-months":
      startDate = subMonths(startOfMonth(now), 5);
      endDate = endOfMonth(now);
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(date => format(date, "yyyy-MM"));
      break;

    case "today":
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      dates = eachHourOfInterval({ start: startDate, end: endDate }).map(date => format(date, "yyyy-MM-dd HH"));
      break;

    default:
      throw new Error('Invalid period');
  }

  return dates;
};

const groupAndMapData = ({module, period}: any) => {
   const groupedData = module.reduce((acc, i) => {
    const date = new Date(i.createdAt);
    let dateKey;
    if (period === "this-year" || period === "6-months") {
      dateKey = format(date, "yyyy-MM");
    } else if (period === "today") {
      dateKey = format(date, "yyyy-MM-dd HH");
    } else {
      dateKey = format(date, "yyyy-MM-dd");
    }
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  // Map the grouped data to the desired format
  return Object.entries(groupedData).map(([date, count]) => ({
    date,
    count
  }));
}

// get Date ranges
const getDateRange = (period: string) => {
  const now = new Date();
  
  switch (period) {
    case "today":
      return {
        fromDate: startOfDay(now),
        toDate: endOfDay(now)
      };
    case "this-week":
      return {
        fromDate: startOfWeek(now),
        toDate: endOfWeek(now)
      };
    case "this-month":
      return {
        fromDate: startOfMonth(now),
        toDate: endOfMonth(now)
      };
    case "6-months":
      return {
        fromDate: startOfMonth(subMonths(now, 6)),
        toDate: endOfMonth(now)
      };
    case "this-year":
      return {
        fromDate: startOfYear(now),
        toDate: endOfYear(now)
      };
    default:
      throw new Error('Invalid period');
  }
};

export const getAnalytics = async (organizationId: string, period = "this-month") => {
  try {
    const { fromDate, toDate } = getDateRange(period);
    
    console.log({ organizationId, fromDate, toDate });

    const [orgData, interactedChats, callScheduledTimeline, siteVisitTimeline, locationTimeline, virtualTourTimeline] = await Promise.all([
      db.query.organizationSchema.findFirst({
        where: eq(organizationSchema.id, organizationId),
        with: {
          botUsers: {
            where: and(
              gte(botUserSchema.createdAt, fromDate),
              lte(botUserSchema.createdAt, toDate)
            ),
          },
          bots: {
            with: {
              chats: {
                where: and(
                  gte(chatSchema.createdAt, fromDate),
                  lte(chatSchema.createdAt, toDate)
                ),
              },
            },
          },
          leads: {
            where: and(
              gte(leadSchema.createdAt, fromDate),
              lte(leadSchema.createdAt, toDate)
            ),
          },
        },
      }),
      db.select({ count: count() })
        .from(chatSchema)
        .where(
          and(
            gte(chatSchema.createdAt, fromDate),
            lte(chatSchema.createdAt, toDate),
            eq(chatSchema.interacted, true),
            eq(chatSchema.organizationId, organizationId)
          )
        ),
      db.select({ count: count() })
        .from(timelineSchema)
        .where(
          and(
            gte(timelineSchema.createdAt, fromDate),
            lte(timelineSchema.createdAt, toDate),
            eq(timelineSchema.orgId, organizationId),
            eq(timelineSchema.intent, "schedule_call")
          )
        ),
      db.select({ count: count() })
        .from(timelineSchema)
        .where(
          and(
            gte(timelineSchema.createdAt, fromDate),
            lte(timelineSchema.createdAt, toDate),
            eq(timelineSchema.orgId, organizationId),
            eq(timelineSchema.intent, "site_visit")
          )
        ),
      db.select({ count: count() })
        .from(timelineSchema)
        .where(
          and(
            gte(timelineSchema.createdAt, fromDate),
            lte(timelineSchema.createdAt, toDate),
            eq(timelineSchema.orgId, organizationId),
            eq(timelineSchema.intent, "location")
          )
        ),
      db.select({ count: count() })
        .from(timelineSchema)
        .where(
          and(
            gte(timelineSchema.createdAt, fromDate),
            lte(timelineSchema.createdAt, toDate),
            eq(timelineSchema.orgId, organizationId),
            eq(timelineSchema.intent, "virtual_tour")
          )
        ),
    ]);


    if (!orgData) return undefined;

    const [leadData, sessionData, sessions] = await Promise.all([
      db.select({ createdAt: leadSchema.createdAt })
        .from(leadSchema)
        .leftJoin(organizationSchema, eq(leadSchema.organizationId, organizationSchema.id))
        .where(
          and(
            eq(organizationSchema.id, organizationId),
            gte(leadSchema.createdAt, fromDate),
            lte(leadSchema.createdAt, toDate)
          )
        )
        .groupBy(sql`${leadSchema.createdAt}`)
        .execute(),
      db.select({ createdAt: chatSchema.createdAt })
        .from(chatSchema)
        .leftJoin(chatBotSchema, eq(chatBotSchema.id, chatSchema.botId))
        .leftJoin(organizationSchema, eq(organizationSchema.id, chatBotSchema.organizationId))
        .where(
          and(
            eq(organizationSchema.id, organizationId),
            gte(chatSchema.createdAt, fromDate),
            lte(chatSchema.createdAt, toDate)
          )
        )
        .groupBy(sql`${chatSchema.createdAt}`)
        .execute(),
      db.query.analyticsSchema.findFirst({
        where: eq(analyticsSchema.organizationId, organizationId),
      })
    ]);

    const dates = getAllDatesInRange(period);

    // return { leadData }

    const leadResult = groupAndMapData({ module: leadData, period });
    const sessionResult = groupAndMapData({ module: sessionData, period });

    const leadMap = new Map(leadResult.map(item => [item.date, item.count]));
    const sessionMap = new Map(sessionResult.map(item => [item.date, item.count]));

    const groupedCounts = (mapData: any) => dates.map(date => ({
      date,
      count: mapData.get(date) || 0
    }));

    return {
      bots: orgData.bots.length,
      chats: orgData.bots.reduce((acc, bot) => acc + bot.chats.length, 0),
      users: orgData.botUsers.length,
      leads: orgData.leads.length,
      sessions: sessions?.sessions ?? 0,
      virtualTourTimeline,
      locationTimeline,
      siteVisitTimeline,
      callScheduledTimeline,
      interactedChats,
      graph: {
        leads: groupedCounts(leadMap),
        sessions: groupedCounts(sessionMap)
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch: ${error}`);
  }
};
