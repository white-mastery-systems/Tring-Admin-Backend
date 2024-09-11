import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  adminConfigurationSchema,
  adminPricingSchema,
  campaignSchema,
  contactListSchema,
  paymentSchema,
} from "../schema/admin";
import { analyticsRelations, chatBotIntegrationRelations } from "../schema/bot";
import { voicebotIntegrationSchema } from "../schema/voicebot";

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
  paymentSchema,
  botIntentSchema,
  integrationSchema,
  botIntegrationSchema,
  analyticsSchema,
  timelineSchema,
  voicebotSchema,
  voicebotIntegrationSchema,
  adminConfigurationSchema,
  adminPricingSchema,
  numberIntegrationSchema,
  contactListSchema,
  contactSchema,
  campaignSchema,
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
  analyticsRelations,
};

const db = drizzle(queryClient, { schema });

export const useDrizzle = () => db;
