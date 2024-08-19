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
  });
  return data;
};

export const deleteIntegration = async (integrationId: string) => {
  //   cache.removeItem(getCacheBotKey(botId));
  return (
    await db
      .delete(integrationSchema)
      .where(eq(integrationSchema.id, integrationId))
      .returning()
  )[0];
};
