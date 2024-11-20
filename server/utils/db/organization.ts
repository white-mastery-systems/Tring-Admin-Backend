import { max, sum } from "drizzle-orm";
import { logger } from "~/server/logger";
import {
  calculatePercentageChange,
  getAllDatesInRange,
  getDateRange,
  groupAndMapData,
} from "../analytics";
import { getPricingInformation } from "./pricing";
import momentTz from "moment-timezone";

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
  return (
    await db
      .update(organizationSchema)
      .set({
        ...organization,
        updatedAt: new Date(),
      })
      .where(eq(organizationSchema.id, id))
      .returning()
  )[0];
};

// Organization visitors
export const createOrgVisitors = async (body: any) => {
  return (
    await db.insert(orgVisitorSchema).values(body).returning()
  )[0]
}

export const getOrgVisitor = async (organizationId: string, visitorId: string) => {
  return await db.query.orgVisitorSchema.findFirst({
    where: and(
      eq(orgVisitorSchema.organizationId, organizationId),
      eq(orgVisitorSchema.visitorId, visitorId)
    )
  })
}

export const updateOrgVisitor = async (visitorId: string) => {
  return (
    await db.update(orgVisitorSchema)
    .set({ updatedAt: new Date() })
    .where(eq(orgVisitorSchema.visitorId, visitorId))
    .returning()
  )[0]
}

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
//         eq(timelineSchema.event, "schedule_call"),
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
//         eq(timelineSchema.event, "site_visit"),
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
//         eq(timelineSchema.event, "location"),
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
//         eq(timelineSchema.event, "virtual_tour"),
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

const updateChatbotStatus = async(organizationId: string) => {
  await db
  .update(chatBotSchema)
  .set({ documentId: null })
  .where(
    and(eq(chatBotSchema.organizationId, organizationId),
  ))
}

const updateOrgSubscriptionStatus = async(organizationId: string, status: string) => {
  await db
  .update(orgSubscriptionSchema)
  .set({ status: status })
  .where(eq(orgSubscriptionSchema.organizationId, organizationId))
}


export const getOrgUsage = async (organizationId: string, timeZone: string, query: any) => {
  // Determine date range for the current month
  const currentDate = momentTz().tz(timeZone).toDate();
  const currentMonthStartDate = momentTz().tz(timeZone).startOf("month").toDate()
  const currentMonthEndDate = momentTz().tz(timeZone).endOf("month").toDate()

  const [org, interactedSessions, orgSubscription] = await Promise.all([
    getOrganizationById(organizationId),
    db.query.chatSchema.findMany({
      where: and(
        gte(chatSchema.createdAt, currentMonthStartDate),
        lte(chatSchema.createdAt, currentMonthEndDate),
        eq(chatSchema.interacted, true),
        eq(chatSchema.organizationId, organizationId),
      ),
    }),
    db.query.orgSubscriptionSchema.findFirst({
      where: and(
        eq(orgSubscriptionSchema.organizationId, organizationId),
      ),
    }),
  ]);
  
  if (!org) {
     throw new Error("organization not found")
  }
 
  // get Pricing information
  const pricingInformation = await getPricingInformation(org?.planCode)

  let subscriptionStatus: "inactive" | "active" = "active";
  const extraSessionCost = pricingInformation?.extraSessionCost || 0

  // const usedSessions = 10000
  const maxSessions = pricingInformation?.sessions || 0;
  const usedSessions = interactedSessions?.length || 0;
  const availableSessions = Math.max(maxSessions - usedSessions, 0)

  const orgWalletSessions = orgSubscription?.walletSessions || 0
  let extraSessions = 0

  const updateStatuses = async (newStatus: "active" | "inactive") => {
    if (orgSubscription?.status !== newStatus) {
      await updateOrgSubscriptionStatus(organizationId, newStatus);
    }
    if(newStatus === "inactive") {
      await updateChatbotStatus(organizationId);
    }
  };

  const resObj = {
    used_quota: usedSessions,
    max_quota: maxSessions,
    plan_code: org.planCode,
    wallet_balance: orgWalletSessions,
    extra_sessions_cost: extraSessionCost,
    gst: org?.metadata?.gst,
    extra_sessions: extraSessions,
    available_sessions: availableSessions,
    expiry_date: orgSubscription?.expiryDate ?? undefined
  };

  // If there is no active subscription or no additional sessions available (i.e free-plan)
  if (!orgSubscription) {
    subscriptionStatus = usedSessions > maxSessions ? "inactive" : "active";
    await updateStatuses(subscriptionStatus);
    return { ...resObj, subscription_status: subscriptionStatus };
  }
  
  // Calculate expiry date and check if the subscription is expired
  const expiryDate = momentTz(orgSubscription.expiryDate)
  .tz(timeZone)
  .toDate();

  if (currentDate > expiryDate) {
    subscriptionStatus = "inactive";
    await updateStatuses(subscriptionStatus);
    return { ...resObj, subscription_status: subscriptionStatus };
  }
  
  if(usedSessions >= maxSessions) {
    extraSessions = Math.max(usedSessions - maxSessions, 0)
    const currentWallet = Math.max(orgWalletSessions - extraSessions, 0)
    if (currentWallet > 0) {
      subscriptionStatus = "active";
      await updateStatuses(subscriptionStatus);
      return { ...resObj, subscription_status: subscriptionStatus, wallet_balance: currentWallet, extra_sessions: extraSessions, extra_sessions_cost: extraSessions * Number(pricingInformation?.extraSessionCost) };
    } else {
      subscriptionStatus = "inactive";
      await updateStatuses(subscriptionStatus);
      return { ...resObj, subscription_status: subscriptionStatus, wallet_balance: currentWallet ,extra_sessions: extraSessions, extra_sessions_cost: extraSessions * Number(pricingInformation?.extraSessionCost) };
    }
  }
  subscriptionStatus = "active";
  await updateStatuses(subscriptionStatus);
  return { ...resObj, subscription_status: subscriptionStatus };
};

const validQueryValues = [
  "leads",
  "sessions",
  "unique_visitors",
  "interacted_chats",
  "schedule_call",
  "site_visit",
  "location",
  "virtual_tour",
  "images",
  "brochures",
];

export const getAnalytics = async (
  organizationId: string,
  period = "last-30-days",
  customFromDate: Date | null,
  customToDate: Date | null,
  graphValues: string | undefined,
  timeZone: string,
) => {
  try {
    const queryArray = graphValues
      ?.trim()
      ?.split(",")
      .map((value) => value.trim()) || ["leads", "sessions"];

    const organizationIntents = await db
      .select({ intents: botIntentSchema.intent })
      .from(botIntentSchema)
      .where(eq(botIntentSchema.organizationId, organizationId));

    const intentList = [
      ...new Set(organizationIntents.map((i: any) => i.intents)),
    ];

    // Validate query-values
    const inValidQuery = queryArray.filter(
      (i) => !validQueryValues.includes(i),
    );
    if (inValidQuery.length) {
      throw new Error("Invalid query values");
    }

    let from = customFromDate;
    let to = customToDate;
    if (period === "all-time") {
      const earliestData = await db.query.chatBotSchema.findFirst({
        columns: {
          createdAt: true,
        },
        where: and(eq(chatBotSchema.organizationId, organizationId)),
        orderBy: [asc(chatBotSchema.createdAt)],
      });
      // console.log({ earliestData: earliestData?.createdAt })
      from = earliestData?.createdAt;
    }

    const { fromDate, toDate, previousFromDate, previousToDate } = getDateRange(
      period,
      from,
      to,
      timeZone,
    );

    // find organization intents statistics
    const mapIntents = await Promise.all(
      intentList.map(async (intent) => {
        const intentDetail = await db
          .select({ createdAt: timelineSchema.createdAt })
          .from(timelineSchema)
          .where(
            and(
              gte(timelineSchema.createdAt, fromDate),
              lte(timelineSchema.createdAt, toDate),
              eq(timelineSchema.orgId, organizationId),
              eq(timelineSchema.event, intent),
            ),
          );
        // Find previous date intents
        const previousDateIntentDetail = await db
          .select({ createdAt: timelineSchema.createdAt })
          .from(timelineSchema)
          .where(
            and(
              gte(timelineSchema.createdAt, previousFromDate),
              lte(timelineSchema.createdAt, previousToDate),
              eq(timelineSchema.orgId, organizationId),
              eq(timelineSchema.event, intent),
            ),
          );
        return {
          name: intent,
          value: intentDetail.length,
          intentDetail,
          previousDateValue: previousDateIntentDetail?.length,
        };
      }),
    );

    // return {mapIntents}

    // get current period statistics
    const [orgData, leads, chats, uniqueVisiters, interactedChats] =
      await Promise.all([
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
          .select()
          .from(orgVisitorSchema)
          .where(
            and(
              gte(orgVisitorSchema.createdAt, fromDate),
              lte(orgVisitorSchema.createdAt, toDate),
              eq(orgVisitorSchema.organizationId, organizationId),
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
      ]);

    // get previous date statistics
    const [
      previousLeads,
      previousChats,
      previousUniqueVisiters,
      previousInteractedChats,
    ] = await Promise.all([
      db
        .select({ createdAt: leadSchema.createdAt })
        .from(leadSchema)
        .where(
          and(
            gte(leadSchema.createdAt, previousFromDate),
            lte(leadSchema.createdAt, previousToDate),
            eq(leadSchema.organizationId, organizationId),
          ),
        ),
      db
        .select({ createdAt: chatSchema.createdAt })
        .from(chatSchema)
        .where(
          and(
            gte(chatSchema.createdAt, previousFromDate),
            lte(chatSchema.createdAt, previousToDate),
            eq(chatSchema.organizationId, organizationId),
          ),
        ),
      db
        .select()
        .from(orgVisitorSchema)
        .where(
          and(
            gte(orgVisitorSchema.createdAt, previousFromDate),
            lte(orgVisitorSchema.createdAt, previousToDate),
            eq(orgVisitorSchema.organizationId, organizationId),
          )
        ),
      db
        .select({ createdAt: chatSchema.createdAt })
        .from(chatSchema)
        .where(
          and(
            gte(chatSchema.createdAt, previousFromDate),
            lte(chatSchema.createdAt, previousToDate),
            eq(chatSchema.interacted, true),
            eq(chatSchema.organizationId, organizationId),
          ),
        ),
    ]);    

    if (!orgData) return undefined;

    //Graph values
    const { dates, difference } = getAllDatesInRange(
      period,
      from,
      to,
      timeZone,
    );

    let uniqueVisitersMap = null;
    let interactedChatsMap = null;
    let graphMap = null;

    // Leads Graph
    const leadResult = groupAndMapData({
      module: leads,
      period,
      difference,
      timeZone,
    });
    const leadMap = new Map(leadResult.map((item) => [item.date, item.count]));

    // sessions Graph
    const sessionResult = groupAndMapData({
      module: chats,
      period,
      difference,
      timeZone,
    });
    const sessionMap = new Map(
      sessionResult.map((item) => [item.date, item.count]),
    );

    // unique-visitors Graph
    if (queryArray.includes("unique_visitors")) {
      const uniqueVisitersResult = groupAndMapData({
        module: uniqueVisiters,
        period,
        difference,
        timeZone,
      });
      uniqueVisitersMap = new Map(
        uniqueVisitersResult.map((item) => [item.date, item.count]),
      );
    }

    // interacted-chats Graph
    if (queryArray.includes("interacted_chats")) {
      const interactedChatsResult = groupAndMapData({
        module: interactedChats,
        period,
        difference,
        timeZone,
      });
      interactedChatsMap = new Map(
        interactedChatsResult.map((item) => [item.date, item.count]),
      );
    }

    // Intents Graph
    const mapIntentsGraphValues = mapIntents.map((i) => {
      const result = groupAndMapData({
        module: i.intentDetail,
        period,
        difference,
        timeZone,
      });

      graphMap = new Map(result.map((item) => [item.date, item.count]));

      return {
        intent: i.name,
        result: result,
        graphMap,
      };
    });

    const groupedCounts = (mapData: any) =>
      dates.map((date) => ({
        date,
        count: mapData.get(date) || 0,
      }));

    // Mapping intent as key and graphMap as value
    let intentsMapping = mapIntentsGraphValues.reduce((acc: any, item: any) => {
      acc[item?.intent] = item.graphMap;
      return acc;
    }, {});

    const safeGroupedCounts = (map: any) => (map ? groupedCounts(map) : {});

    const maps = {
      leads: leadMap,
      sessions: sessionMap,
      unique_visitors: uniqueVisitersMap,
      interacted_chats: interactedChatsMap,
      ...intentsMapping,
    };

    const graph = Object.entries(maps).reduce((acc: any, [key, map]) => {
      if (!queryArray.length || queryArray.includes(key)) {
        acc[key] = safeGroupedCounts(map);
      }
      return acc;
    }, {});

    const graphArray = queryArray.map((key) => graph[key]).filter(Boolean);
    let statistics = [
      {
        name: "chat sessions",
        value: chats?.length,
        apiName: "sessions",
        color: "#facc15",
        averagePercentage: calculatePercentageChange(
          chats?.length,
          previousChats?.length,
        ),
      },
      {
        name: "unique visitors",
        value: uniqueVisiters?.length ?? 0,
        apiName: "unique_visitors",
        color: "#a855f7",
        averagePercentage: calculatePercentageChange(
          uniqueVisiters?.length ?? 0,
          previousUniqueVisiters?.length,
        ),
      },
      {
        name: "chat leads",
        value: leads?.length,
        apiName: "leads",
        color: "#4f46e5",
        averagePercentage: calculatePercentageChange(
          leads?.length,
          previousLeads?.length,
        ),
      },
      {
        name: "interacted chats",
        value: interactedChats?.length,
        apiName: "interacted_chats",
        color: "#dc2626",
        averagePercentage: calculatePercentageChange(
          interactedChats?.length,
          previousInteractedChats?.length,
        ),
      },
      // Spread the mapIntents into statistics
      ...mapIntents.map((intent) => {
        if (intent?.name === "site_visit") {
          return {
            name: "site visits",
            value: intent?.value,
            apiName: intent.name,
            color: "#2563eb",
            averagePercentage: calculatePercentageChange(
              intent?.value,
              intent?.previousDateValue,
            ),
          };
        }
        if (intent?.name === "schedule_call") {
          return {
            name: "call scheduled",
            value: intent?.value,
            apiName: intent.name,
            color: "#16a34a",
            averagePercentage: calculatePercentageChange(
              intent?.value,
              intent?.previousDateValue,
            ),
          };
        }
        if (intent?.name === "virtual_tour") {
          return {
            name: "virtual tours",
            value: intent?.value,
            apiName: intent.name,
            color: "#e11d48",
            averagePercentage: calculatePercentageChange(
              intent?.value,
              intent?.previousDateValue,
            ),
          };
        }
        if (intent?.name === "location") {
          return {
            name: "location visited",
            value: intent?.value,
            apiName: intent.name,
            color: "#1e293b",
            averagePercentage: calculatePercentageChange(
              intent?.value,
              intent?.previousDateValue,
            ),
          };
        }
        if (intent?.name === "images") {
          return {
            name: intent.name,
            value: intent?.value,
            apiName: intent.name,
            color: "#FA8072",
            averagePercentage: calculatePercentageChange(
              intent?.value,
              intent?.previousDateValue,
            ),
          };
        }
        if (intent?.name === "brochures") {
          return {
            name: intent.name,
            value: intent?.value,
            apiName: intent.name,
            color: "#40E0D0",
            averagePercentage: calculatePercentageChange(
              intent?.value,
              intent?.previousDateValue,
            ),
          };
        }
      }),
    ]
      .filter((item) => item !== undefined)
      .sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0));

    return {
      statistics,
      graph: graphArray,
    };
  } catch (error) {
    logger.error(`Error: getAnalytics catch block:${JSON.stringify(error)}`);
    throw new Error(`Failed to fetch: ${error}`);
  }
};
