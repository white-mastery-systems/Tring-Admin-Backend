import { pgSchema } from "drizzle-orm/pg-core";

export const adminSchema = pgSchema("admin");
export const chatbotSchema = pgSchema("chatbot");
export const voicebot = pgSchema("voicebot");

