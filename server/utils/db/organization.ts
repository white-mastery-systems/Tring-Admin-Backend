import {
  differenceInDays,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { count } from "drizzle-orm";
import { getPricingInformation } from "./pricing";

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
  const org: any = await getOrganizationById(organizationId);
  const pricingInformation = await getPricingInformation(org?.planCode);
  console.log({ pricingInformation });
  if (!org) return undefined;

  return {
    used_quota: org.usedQuota,
    max_quota: org.maxQuota,
    plan_code: org.planCode,
    available_quota: org.maxQuota - org.usedQuota,
  };
};

// Date range generation function
const getAllDatesInRange = (period: string, from: Date, to: Date) => {
  let dates: string[] = [];
  let startDate: Date, endDate: Date;
  let difference = 0;

  const now = new Date();

  switch (period) {
    case "today":
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      dates = eachHourOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "hh:mm a"),
      );
      break;

    case "yesterday":
      startDate = startOfDay(subDays(now, 1));
      endDate = endOfDay(subDays(now, 1));
      dates = eachHourOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "hh:mm a"),
      );
      break;

    case "last-7-days":
      startDate = startOfDay(subDays(now, 7));
      endDate = endOfDay(now);
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "dd MMM yyyy"),
      );
      break;

    case "last-30-days":
      startDate = startOfDay(subDays(now, 30));
      endDate = endOfDay(now);
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "dd MMM yyyy"),
      );
      break;

    case "current-month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "dd MMM yyyy"),
      );
      break;

    case "last-month":
      startDate = startOfMonth(subMonths(now, 1));
      endDate = endOfMonth(subMonths(now, 1));
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "dd MMM yyyy"),
      );
      break;

    case "current-year":
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "yyyy-MM"),
      );
      break;

    case "last-year":
      startDate = startOfYear(subYears(now, 1));
      endDate = endOfYear(subYears(now, 1));
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "yyyy-MM"),
      );
      break;

    case "current-financial-year":
      startDate = new Date(now.getFullYear(), 3, 1); // April 1st of the current year
      endDate = new Date(now.getFullYear() + 1, 2, 31); // March 31st of the next year
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "yyyy-MM"),
      );
      break;

    case "last-financial-year":
      startDate = new Date(now.getFullYear() - 1, 3, 1); // April 1st of the last year
      endDate = new Date(now.getFullYear(), 2, 31); // March 31st of the current year
      dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "yyyy-MM-dd"),
      );
      break;

    case "all-time":
      startDate = startOfYear(from);
      endDate = endOfYear(now);
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "yyyy-MM"),
      );
      break;

    case "custom":
      difference = differenceInDays(to, from);
      // console.log({ difference })
      if (difference > 30) {
        startDate = startOfYear(from);
        endDate = endOfYear(to);
        dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
          (date) => format(date, "yyyy-MM"),
        );
      } else {
        startDate = startOfDay(from);
        endDate = endOfDay(to);
        dates = eachDayOfInterval({ start: startDate, end: endDate }).map(
          (date) => format(date, "dd MMM yyyy"),
        );
      }
      break;

    default:
      throw new Error("Invalid period");
  }

  return {
    dates,
    difference,
  };
};

const groupAndMapData = ({ module, period, difference }: any) => {
  const groupedData = module.reduce((acc, i) => {
    // console.log({ groupAndMapDataDifference: difference })
    const date = new Date(i.createdAt).setMinutes(0);

    // const timeZone = 'Asia/Kolkata';
    // const date = formatInTimeZone(created, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    // const isoDate = new Date(date)
    // console.log({created_at: i.createdAt, date, isoDate})
    let dateKey;
    if (period === "today" || period === "yesterday") {
      dateKey = format(date, "hh:mm a");
    } else if (
      period === "current-year" ||
      period === "last-year" ||
      period === "current-financial-year" ||
      period === "last-financial-year" ||
      period === "all-time" ||
      difference > 30
    ) {
      dateKey = format(date, "yyyy-MM");
    } else {
      dateKey = format(date, "dd MMM yyyy");
    }
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  // console.log({ groupedData })

  // Map the grouped data to the desired format
  return Object.entries(groupedData).map(([date, count]) => ({
    date,
    count,
  }));
};

// get Date ranges
const getDateRange = (period: string, from: Date, to: Date) => {
  const now = new Date();
  // console.log("------", { period, from, to })

  switch (period) {
    case "today":
      return {
        fromDate: startOfDay(now),
        toDate: endOfDay(now),
      };
    case "yesterday":
      return {
        fromDate: startOfDay(subDays(now, 1)),
        toDate: endOfDay(subDays(now, 1)),
      };
    case "last-7-days":
      return {
        fromDate: startOfDay(subDays(now, 7)),
        toDate: endOfDay(now),
      };
    case "last-30-days":
      return {
        fromDate: startOfDay(subDays(now, 30)),
        toDate: endOfDay(now),
      };
    case "current-month":
      return {
        fromDate: startOfMonth(now),
        toDate: endOfMonth(now),
      };
    case "last-month":
      return {
        fromDate: startOfMonth(subMonths(now, 1)),
        toDate: endOfMonth(subMonths(now, 1)),
      };
    case "current-year":
      return {
        fromDate: startOfYear(now),
        toDate: endOfYear(now),
      };
    case "last-year":
      return {
        fromDate: startOfYear(subYears(now, 1)),
        toDate: endOfYear(subYears(now, 1)),
      };
    case "current-financial-year":
      return {
        fromDate: new Date(now.getFullYear(), 3, 1), // April 1st of the current year
        toDate: new Date(now.getFullYear() + 1, 2, 31), // March 31st of the next year
      };
    case "last-financial-year":
      return {
        fromDate: new Date(now.getFullYear() - 1, 3, 1), // April 1st of the last year
        toDate: new Date(now.getFullYear(), 2, 31), // March 31st of the current year
      };
    case "all-time":
      return {
        fromDate: startOfYear(from),
        toDate: endOfYear(now),
      };

    case "custom":
      return {
        fromDate: from,
        toDate: to,
      };

    default:
      throw new Error("Invalid period");
  }
};

export const getAnalytics = async (
  organizationId: string,
  period = "current-month",
  customFromDate: Date | null,
  customToDate: Date | null,
) => {
  try {
    let from = customFromDate;
    let to = customToDate;
    if (period == "all-time") {
      const earliestData = await db.query.chatBotSchema.findFirst({
        columns: {
          createdAt: true,
        },
        where: and(eq(chatBotSchema.organizationId, organizationId)),
        orderBy: [asc(chatBotSchema.createdAt)],
      });
      // console.log({ earliestData})
      from = earliestData?.createdAt;
    }
    //  return

    const { fromDate, toDate } = getDateRange(period, from, to);

    const [
      orgData,
      uniqueVisiters,
      interactedChats,
      callScheduledTimeline,
      siteVisitTimeline,
      locationTimeline,
      virtualTourTimeline,
    ] = await Promise.all([
      db.query.organizationSchema.findFirst({
        where: eq(organizationSchema.id, organizationId),
        with: {
          botUsers: {
            where: and(
              gte(botUserSchema.createdAt, fromDate),
              lte(botUserSchema.createdAt, toDate),
            ),
          },
          bots: {
            with: {
              chats: {
                where: and(
                  gte(chatSchema.createdAt, fromDate),
                  lte(chatSchema.createdAt, toDate),
                ),
              },
            },
          },
          leads: {
            where: and(
              gte(leadSchema.createdAt, fromDate),
              lte(leadSchema.createdAt, toDate),
            ),
          },
        },
      }),
      db
        .select({ id: chatSchema.id })
        .from(chatSchema)
        .where(
          and(
            gte(chatSchema.createdAt, fromDate),
            lte(chatSchema.createdAt, toDate),
            eq(chatSchema.organizationId, organizationId),
            gt(chatSchema.visitedCount, 1),
          ),
        ),
      db
        .select({ count: count() })
        .from(chatSchema)
        .where(
          and(
            gte(chatSchema.createdAt, fromDate),
            lte(chatSchema.createdAt, toDate),
            eq(chatSchema.interacted, true),
            eq(chatSchema.organizationId, organizationId),
          ),
        ),
      db
        .select({ count: count() })
        .from(timelineSchema)
        .where(
          and(
            gte(timelineSchema.createdAt, fromDate),
            lte(timelineSchema.createdAt, toDate),
            eq(timelineSchema.orgId, organizationId),
            eq(timelineSchema.intent, "schedule_call"),
          ),
        ),
      db
        .select({ count: count() })
        .from(timelineSchema)
        .where(
          and(
            gte(timelineSchema.createdAt, fromDate),
            lte(timelineSchema.createdAt, toDate),
            eq(timelineSchema.orgId, organizationId),
            eq(timelineSchema.intent, "site_visit"),
          ),
        ),
      db
        .select({ count: count() })
        .from(timelineSchema)
        .where(
          and(
            gte(timelineSchema.createdAt, fromDate),
            lte(timelineSchema.createdAt, toDate),
            eq(timelineSchema.orgId, organizationId),
            eq(timelineSchema.intent, "location"),
          ),
        ),
      db
        .select({ count: count() })
        .from(timelineSchema)
        .where(
          and(
            gte(timelineSchema.createdAt, fromDate),
            lte(timelineSchema.createdAt, toDate),
            eq(timelineSchema.orgId, organizationId),
            eq(timelineSchema.intent, "virtual_tour"),
          ),
        ),
    ]);

    if (!orgData) return undefined;

    const [leadData, sessionData, sessions] = await Promise.all([
      db
        .select({ createdAt: leadSchema.createdAt })
        .from(leadSchema)
        .leftJoin(
          organizationSchema,
          eq(leadSchema.organizationId, organizationSchema.id),
        )
        .where(
          and(
            eq(organizationSchema.id, organizationId),
            gte(leadSchema.createdAt, fromDate),
            lte(leadSchema.createdAt, toDate),
          ),
        )
        .groupBy(sql`${leadSchema.createdAt}`)
        .execute(),
      db
        .select({ createdAt: chatSchema.createdAt })
        .from(chatSchema)
        .leftJoin(chatBotSchema, eq(chatBotSchema.id, chatSchema.botId))
        .leftJoin(
          organizationSchema,
          eq(organizationSchema.id, chatBotSchema.organizationId),
        )
        .where(
          and(
            eq(organizationSchema.id, organizationId),
            gte(chatSchema.createdAt, fromDate),
            lte(chatSchema.createdAt, toDate),
          ),
        )
        .groupBy(sql`${chatSchema.createdAt}`)
        .execute(),
      db.query.analyticsSchema.findFirst({
        where: eq(analyticsSchema.organizationId, organizationId),
      }),
    ]);

    const { dates, difference } = getAllDatesInRange(period, from, to);

    //  return { dates }
    // return { sessionData }

    const leadResult = groupAndMapData({
      module: leadData,
      period,
      difference,
    });
    const sessionResult = groupAndMapData({
      module: sessionData,
      period,
      difference,
    });
    // return { sessionResult, dates }

    const leadMap = new Map(leadResult.map((item) => [item.date, item.count]));
    const sessionMap = new Map(
      sessionResult.map((item) => [item.date, item.count]),
    );

    // return {  sessionMap }

    const groupedCounts = (mapData: any) =>
      dates.map((date) => ({
        date,
        count: mapData.get(date) || 0,
      }));
    //  return {
    //     leads: groupedCounts(leadMap),
    //     sessions: groupedCounts(sessionMap),
    //   }

    return {
      bots: orgData.bots.length,
      chats: orgData.bots.reduce((acc, bot) => acc + bot.chats.length, 0),
      users: uniqueVisiters.length ?? 0,
      leads: orgData.leads.length,
      sessions: sessions?.sessions ?? 0,
      virtualTourTimeline,
      locationTimeline,
      siteVisitTimeline,
      callScheduledTimeline,
      interactedChats,
      graph: {
        leads: groupedCounts(leadMap),
        sessions: groupedCounts(sessionMap),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch: ${error}`);
  }
};
