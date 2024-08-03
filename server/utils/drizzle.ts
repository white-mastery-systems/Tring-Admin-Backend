import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const runtimeConfig = useRuntimeConfig();

const queryClient = new pg.Pool({ connectionString: runtimeConfig.dbUrl });

const schema = {
  organizationSchema,
  authUserSchema,
  authSessionSchema,
};

const db = drizzle(queryClient, { schema });

export const useDrizzle = () => db;
