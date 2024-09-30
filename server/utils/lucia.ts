import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import type { H3Event } from "h3";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(
  useDrizzle(),
  authSessionSchema,
  authUserSchema,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // secure: !import.meta.dev,
      secure: true,
    },
    getSessionAttributes: (attributes) => {
      console.log({ attributes });
      return {
        ipCountry: attributes.ip_country,
      };
    },
  },
  getUserAttributes: (attributes) => ({
    username: attributes.username,
    role: attributes.role,
    email: attributes.email,
    organizationId: attributes.organizationId,
  }),
});

export const isValidUser = (event: H3Event, role: string) => {
  if (event.context.user?.role === role) return true;

  return sendError(
    event,
    createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Unauthorized",
    }),
  );
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  role: string;
  email: string;
  organizationId: string;
}
