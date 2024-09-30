// // server/auth.ts
// import { drizzle } from "@lucia-auth/adapter-drizzle";
// import { lucia } from "lucia";
// // import { sessions, users } from "./db/schema"; // You'll need to create this schema file
// export const auth = lucia({
//   adapter: drizzle(db, authSessionSchema, authUserSchema),
//   env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
//   transformDatabaseUser: (userData: any) => {
//     return {
//       userId: userData.id,
//       username: userData.username,
//     };
//   },
// });

// export type Auth = typeof auth;
