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

export const getAnalytics = async (organizationId: string) => {
  const orgData = await db.query.organizationSchema.findFirst({
    where: eq(organizationSchema.id, organizationId),
    with: {
      botUsers: true,
      bots: {
        with: {
          chats: true,
        },
      },
      leads: true,
    },
  });

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

  if (!orgData) return undefined;

  if (!orgDataByMonth) return undefined;

  return {
    bots: orgData.bots.length,
    chats: orgData.bots.reduce((acc, bot) => {
      return acc + bot.chats.length;
    }, 0),
    users: orgData.botUsers.length,
    leads: orgData.leads.length,
    lead_count: orgDataByMonth.rows,
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
