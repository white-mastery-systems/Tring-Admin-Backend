import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { chatBotIntegrationRelations } from "../schema/bot";

const runtimeConfig = useRuntimeConfig();

const queryClient = new pg.Pool({ connectionString: runtimeConfig.dbUrl });

const schema = {
  // Tables
  organizationSchema,
  authUserSchema,
  authSessionSchema,
  chatBotSchema,
  documentSchema,
  botUserSchema,
  chatSchema,
  messageSchema,
  leadSchema,
  billingSchema,
  botIntentSchema,
  integrationSchema,
  botIntegrationSchema,
  // Relations
  organizationRelations,
  chatBotRelations,
  chatBotIntegrationRelations,
  documentRelations,
  botUserRelations,
  chatsRelations,
  messageRelations,
  leadsRelations,
  billingRelations,
};

const db = drizzle(queryClient, { schema });

export const useDrizzle = () => db;
