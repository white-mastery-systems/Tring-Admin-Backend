import {
  getAllDatesInRange,
  getDateRange,
  groupAndMapData,
} from "../analytics";
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

  if (!org) return undefined;

  return {
    used_quota: org.usedQuota,
    max_quota: pricingInformation?.sessions,
    plan_code: org.planCode,
    available_quota: org.maxQuota - org.usedQuota,
    extra_sessions_cost: pricingInformation?.extraSessionCost,
  };
};

const validQueryValues = [
  "leads",
  "sessions",
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
    const queryArray = graphValues
      ?.trim()
      ?.split(",")
      .map((value) => value.trim()) || ["leads", "sessions"];

    // Validate query-values
    const inValidQuery = queryArray.filter(
      (i) => !validQueryValues.includes(i),
    );
    if (inValidQuery.length) {
      throw new Error("Invalid query values");
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

    const { fromDate, toDate } = getDateRange(period, from, to);

    console.log({ period, organizationId, fromDate, toDate });
    const [
      orgData,
      leads,
      chats,
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
        },
      }),
      db
        .select({ createdAt: leadSchema.createdAt })
        .from(leadSchema)
        .where(
          and(
            gte(leadSchema.createdAt, fromDate),
            lte(leadSchema.createdAt, toDate),
            eq(leadSchema.organizationId, organizationId),
          ),
        ),
      db
        .select({ createdAt: chatSchema.createdAt })
        .from(chatSchema)
        .where(
          and(
            gte(chatSchema.createdAt, fromDate),
            lte(chatSchema.createdAt, toDate),
            eq(chatSchema.organizationId, organizationId),
          ),
        ),
      db
        .select({ createdAt: chatSchema.createdAt })
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

    //Graph values

    const { dates, difference } = getAllDatesInRange(period, from, to);

    let uniqueVisitersMap = null;
    let interactedChatsMap = null;
    let scheduleCallsMap = null;
    let siteVisitsMap = null;
    let locationsMap = null;
    let virtualToursMap = null;

    // Leads Graph
    const leadResult = groupAndMapData({
      module: leads,
      period,
      difference,
    });
    const leadMap = new Map(leadResult.map((item) => [item.date, item.count]));

    // sessions Graph
    const sessionResult = groupAndMapData({
      module: chats,
      period,
      difference,
    });
    const sessionMap = new Map(
      sessionResult.map((item) => [item.date, item.count]),
    );

    if (queryArray.includes("unique_visiters")) {
      const uniqueVisitersResult = groupAndMapData({
        module: uniqueVisiters,
        period,
        difference,
      });
      uniqueVisitersMap = new Map(
        uniqueVisitersResult.map((item) => [item.date, item.count]),
      );
    }

    if (queryArray.includes("interacted_chats")) {
      const interactedChatsResult = groupAndMapData({
        module: interactedChats,
        period,
        difference,
      });
      interactedChatsMap = new Map(
        interactedChatsResult.map((item) => [item.date, item.count]),
      );
    }

    if (queryArray.includes("schedule_calls")) {
      const scheduleCallsResult = groupAndMapData({
        module: callScheduledTimeline,
        period,
        difference,
      });
      scheduleCallsMap = new Map(
        scheduleCallsResult.map((item) => [item.date, item.count]),
      );
    }

    if (queryArray.includes("site_visits")) {
      const siteVisitsResult = groupAndMapData({
        module: siteVisitTimeline,
        period,
        difference,
      });
      siteVisitsMap = new Map(
        siteVisitsResult.map((item) => [item.date, item.count]),
      );
    }

    if (queryArray.includes("locations")) {
      const locationsResult = groupAndMapData({
        module: locationTimeline,
        period,
        difference,
      });
      locationsMap = new Map(
        locationsResult.map((item) => [item.date, item.count]),
      );
    }

    if (queryArray.includes("virtual_tours")) {
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

    const maps = {
      leads: leadMap,
      sessions: sessionMap,
      unique_visiters: uniqueVisitersMap,
      interacted_chats: interactedChatsMap,
      schedule_calls: scheduleCallsMap,
      site_visits: siteVisitsMap,
      locations: locationsMap,
      virtual_tours: virtualToursMap,
    };

    const graph = Object.entries(maps).reduce((acc: any, [key, map]) => {
      if (!queryArray.length || queryArray.includes(key)) {
        acc[key] = safeGroupedCounts(map);
      }
      return acc;
    }, {});

    console.log({ queryArray });

    const graphArray = queryArray.map((key) => graph[key]).filter(Boolean);

    return {
      chats: chats.length,
      users: uniqueVisiters.length ?? 0,
      leads: leads.length,
      virtualTourTimeline: virtualTourTimeline.length,
      locationTimeline: locationTimeline.length,
      siteVisitTimeline: siteVisitTimeline.length,
      callScheduledTimeline: callScheduledTimeline.length,
      interactedChats: interactedChats.length,
      graph: graphArray,
    };
  } catch (error) {
    throw new Error(`Failed to fetch: ${error}`);
  }
};
