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
  console.log({ pricingInformation });
  return {
    used_quota: org.usedQuota,
    max_quota: pricingInformation?.sessions,
    plan_code: org.planCode,
    available_quota: org.maxQuota - org.usedQuota,
    extra_sessions_cost: pricingInformation?.extraSessionCost,
  };
};

// Date range generation function
const getAllDatesInRange = (period: string, from: Date, to: Date) => {
  let dates: string[] = [];
  let startDate: Date, endDate: Date;
  let difference = 0;

  // console.log({ from, to, period })
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
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "last-year":
      startDate = startOfYear(subYears(now, 1));
      endDate = endOfYear(subYears(now, 1));
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "current-financial-year":
      startDate = new Date(now.getFullYear(), 3, 1); // April 1st of the current year
      endDate = new Date(now.getFullYear() + 1, 2, 31); // March 31st of the next year
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "last-financial-year":
      startDate = new Date(now.getFullYear() - 1, 3, 1); // April 1st of the last year
      endDate = new Date(now.getFullYear(), 2, 31); // March 31st of the current year
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "all-time":
      startDate = startOfYear(from);
      endDate = endOfYear(now);
      dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (date) => format(date, "MMM yyyy"),
      );
      break;

    case "custom":
      difference = differenceInDays(to, from);
      // console.log({ difference })
      if (difference > 30) {
        startDate = startOfYear(from);
        endDate = endOfYear(to);
        dates = eachMonthOfInterval({ start: startDate, end: endDate }).map(
          (date) => format(date, "MMM yyyy"),
        );
      } else {
        startDate = from;
        endDate = to;
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
      dateKey = format(date, "MMM yyyy");
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

const validQueryValues = [
  "unique_visiters",
  "interacted_chats",
  "schedule_calls",
  "site_visits",
  "locations",
  "virtual_tours",
];

export const getAnalytics = async (
  organizationId: string,
  period = "current-month",
  customFromDate: Date | null,
  customToDate: Date | null,
  graphValues: string | undefined,
) => {
  try {
    let queryArray =
      typeof graphValues === "string" && graphValues.trim()
        ? graphValues.split(",").map((value) => value.trim())
        : [];

    // validate query-values
    if (queryArray?.length) {
      const inValidQuery = queryArray.filter(
        (i) => !validQueryValues.includes(i),
      );
      if (inValidQuery.length) {
        throw new Error("Invalid query Values");
      }
    }

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
    //  console.log({ period, organizationId, from, to });

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
        .select({ createdAt: chatSchema.createdAt })
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
        .select({ createdAt: timelineSchema.createdAt })
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
        .select({ createdAt: timelineSchema.createdAt })
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
        .select({ createdAt: timelineSchema.createdAt })
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
        .select({ createdAt: timelineSchema.createdAt })
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

    // Graph values
    const promises = [
      // leads
      db
        .select({ createdAt: sql`${leadSchema.createdAt}` })
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
      // sessions
      db
        .select({ createdAt: sql`${chatSchema.createdAt}` })
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
    ];

    if (queryArray.includes("unique_visiters")) {
      promises.push(
        db
          .select({ createdAt: sql`${chatSchema.createdAt}` })
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
              gt(chatSchema.visitedCount, 1),
            ),
          ),
      );
    }

    const [leadGraph, sessionGraph, uniqueVisitersGraph] =
      await Promise.all(promises);

    const { dates, difference } = getAllDatesInRange(period, from, to);
    // console.log({ callScheduledTimeline });
    // return { callScheduledTimeline: callScheduledTimeline }

    let uniqueVisitersMap = null;
    let interactedChatsMap = null;
    let scheduleCallsMap = null;
    let siteVisitsMap = null;
    let locationsMap = null;
    let virtualToursMap = null;
    // let uniqueVisitersMap, interactedChatsMap, scheduleCallsMap, siteVisitsMap, locationsMap, virtualToursMap = null

    const leadResult = groupAndMapData({
      module: leadGraph,
      period,
      difference,
    });
    const sessionResult = groupAndMapData({
      module: sessionGraph,
      period,
      difference,
    });

    const leadMap = new Map(leadResult.map((item) => [item.date, item.count]));
    const sessionMap = new Map(
      sessionResult.map((item) => [item.date, item.count]),
    );

    if (uniqueVisitersGraph) {
      const uniqueVisitersResult = groupAndMapData({
        module: uniqueVisitersGraph,
        period,
        difference,
      });
      uniqueVisitersMap = new Map(
        uniqueVisitersResult.map((item) => [item.date, item.count]),
      );
    }

    if (interactedChats) {
      const interactedChatsResult = groupAndMapData({
        module: interactedChats,
        period,
        difference,
      });
      interactedChatsMap = new Map(
        interactedChatsResult.map((item) => [item.date, item.count]),
      );
    }

    if (callScheduledTimeline) {
      const scheduleCallsResult = groupAndMapData({
        module: callScheduledTimeline,
        period,
        difference,
      });
      scheduleCallsMap = new Map(
        scheduleCallsResult.map((item) => [item.date, item.count]),
      );
    }

    if (siteVisitTimeline) {
      const siteVisitsResult = groupAndMapData({
        module: siteVisitTimeline,
        period,
        difference,
      });
      siteVisitsMap = new Map(
        siteVisitsResult.map((item) => [item.date, item.count]),
      );
    }

    if (locationTimeline) {
      const locationsResult = groupAndMapData({
        module: locationTimeline,
        period,
        difference,
      });
      locationsMap = new Map(
        locationsResult.map((item) => [item.date, item.count]),
      );
    }

    if (virtualTourTimeline) {
      const virtualToursResult = groupAndMapData({
        module: virtualTourTimeline,
        period,
        difference,
      });
      virtualToursMap = new Map(
        virtualToursResult.map((item) => [item.date, item.count]),
      );
    }

    const groupedCounts = (mapData: any) =>
      dates.map((date) => ({
        date,
        count: mapData.get(date) || 0,
      }));

    const safeGroupedCounts = (map) => (map ? groupedCounts(map) : {});

    const graph = {
      ...(!queryArray.length && { leads: safeGroupedCounts(leadMap) }),
      ...(!queryArray.length && { sessions: safeGroupedCounts(sessionMap) }),
      ...(queryArray.includes("unique_visiters") && {
        uniqueVisiters: safeGroupedCounts(uniqueVisitersMap),
      }),
      ...(queryArray.includes("interacted_chats") && {
        interactedChats: safeGroupedCounts(interactedChatsMap),
      }),
      ...(queryArray.includes("schedule_calls") && {
        scheduleCalls: safeGroupedCounts(scheduleCallsMap),
      }),
      ...(queryArray.includes("site_visits") && {
        siteVisits: safeGroupedCounts(siteVisitsMap),
      }),
      ...(queryArray.includes("locations") && {
        locations: safeGroupedCounts(locationsMap),
      }),
      ...(queryArray.includes("virtual_tours") && {
        virtualTours: safeGroupedCounts(virtualToursMap),
      }),
    };

    // console.log({ graph })

    return {
      chats: orgData.bots.reduce((acc, bot) => acc + bot.chats.length, 0),
      users: uniqueVisiters.length ?? 0,
      leads: orgData.leads.length,
      virtualTourTimeline: virtualTourTimeline.length,
      locationTimeline: locationTimeline.length,
      siteVisitTimeline: siteVisitTimeline.length,
      callScheduledTimeline: callScheduledTimeline.length,
      interactedChats: interactedChats.length,
      graph,
    };
  } catch (error) {
    throw new Error(`Failed to fetch: ${error}`);
  }
};
