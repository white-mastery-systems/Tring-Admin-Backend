// import { isNotNull, ne } from "drizzle-orm";

import { integrationSchema } from "#imports";
import { InsertIntegration } from "~/server/schema/admin";

const db = useDrizzle();
// const cache = useStorage("redis");

// const getCacheBotKey = (botId: string) => `chatbot:${botId}`;

export const createIntegration = async (integration: InsertIntegration) =>
  (await db.insert(integrationSchema).values(integration).returning())[0];
export const listIntegrations = async (organizationId: string) => {
  let filters: any = [eq(integrationSchema.org_id, organizationId)];

  const data = await db.query.integrationSchema.findMany({
    where: and(...filters),
    orderBy: [desc(integrationSchema.createdAt)],
    columns: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
  return data;
};
