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

export const getAnalytics = async (
  organizationId: string,
  period = "this-month",
) => {
  let fromDate = new Date();
  let toDate = new Date();
  toDate.setDate(toDate.getDate() + 1);
  switch (period) {
    case "today":
      fromDate.setDate(fromDate.getDate() - 1);
      break;
    case "this-month":
      fromDate.setMonth(fromDate.getMonth() - 1);
      break;
    case "last-month":
      fromDate.setMonth(fromDate.getMonth() - 2);
      break;
    case "this-week":
      fromDate.setDate(fromDate.getDate() - 7);
      break;
    case "6-months":
      fromDate.setMonth(fromDate.getMonth() - 6);
      break;
    case "this-year":
      fromDate.setFullYear(fromDate.getFullYear() - 1);
      break;

    default:
      break;
  }

  const orgData = await db.query.organizationSchema.findFirst({
    where: eq(organizationSchema.id, organizationId),

    with: {
      botUsers: {
        where: and(
          gte(leadSchema.createdAt, fromDate),
          lte(leadSchema.createdAt, toDate),
        ),
      },
      bots: {
        where: and(
          gte(chatBotSchema.createdAt, fromDate),
          lte(chatBotSchema.createdAt, toDate),
        ),
        with: {
          chats: true,
        },
      },
      leads: {
        where: and(
          gte(leadSchema.createdAt, fromDate),
          lte(leadSchema.createdAt, toDate),
        ),
      },
    },
  });

  if (!orgData) return undefined;

  const orgDataByMonth = await db.execute(sql`SELECT
  TO_CHAR(created_at, 'Mon YYYY') AS MONTH,
  COUNT(*) AS lead_count
FROM
  chatbot.bot
WHERE
  organization_id = ${organizationId}
GROUP BY
  organization_id,
  TO_CHAR(created_at, 'Mon YYYY')
ORDER BY
  MONTH;
`);

  const leadsGraph =
    await db.execute(sql`select to_char(l.created_at, 'Mon YYYY') as month, count(*) as count  from admin.organization as o
      join chatbot.leads as l on l.organization_id = o.id
      where o.id = ${organizationId}
      GROUP BY to_char(l.created_at, 'Mon YYYY')`);

  const sessionsGraph =
    await db.execute(sql`select to_char(c.created_at, 'Mon YYYY') as month, count(*) as count  from admin.organization as o
      join chatbot.bot as b on b.organization_id = o.id
      join chatbot.chats as c on c.bot_id = b.id
      where o.id = ${organizationId}
      GROUP BY to_char(c.created_at, 'Mon YYYY')`);
  const sessions = await db.query.analyticsSchema.findFirst({
    where: eq(analyticsSchema.organizationId, organizationId),
  });
  return {
    bots: orgData.bots.length,
    chats: orgData.bots.reduce((acc, bot) => {
      return acc + bot.chats.length;
    }, 0),
    users: orgData.botUsers.length,
    leads: orgData.leads.length,
    sessions: sessions?.sessions ?? 0,
    graph: {
      leads: leadsGraph.rows,
      sessions: sessionsGraph.rows,
    },
  };
};

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
