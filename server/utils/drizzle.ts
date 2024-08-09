import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

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

  // Relations
  organizationRelations,
  chatBotRelations,
  documentRelations,
  botUserRelations,
  chatsRelations,
  messageRelations,
  leadsRelations,
};

const db = drizzle(queryClient, { schema });

export const useDrizzle = () => db;
