import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { contactListAndContactsRelations, contactListContactsSchema, orgSubscriptionSchema, playgroundDocumentSchema, voicebotContactSchema, voiceBucketContactsRelations, voiceContactLinkSchema } from "../schema/admin";
import { userOTPSchema } from "../schema/auth";
import { callLogsRelations, outboundCallSchema, voicebotIntegrationRelations, voicebotRelations } from "../schema/voicebot";
import { botDynamicFormSchema } from "../schema/bot";

const runtimeConfig = useRuntimeConfig();

const queryClient = new pg.Pool({ connectionString: runtimeConfig.dbUrl });

const schema = {
  // Tables
  organizationSchema,
  authUserSchema,
  userOTPSchema,
  authUserRoleSchema,
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
  contactListContactsSchema,
  campaignSchema,
  callLogSchema,
  playgroundDocumentSchema,
  promptSchema,
  templateSchema,
  botDynamicFormSchema,
  orgVisitorSchema,
  orgSubscriptionSchema,
  outboundCallSchema,
  voicebotContactSchema,
  voiceContactLinkSchema,
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
  contactListAndContactsRelations,
  callLogsRelations,
  voicebotRelations,
  userRelations,
  voicebotIntegrationRelations,
  voiceBucketContactsRelations
};

const db = drizzle(queryClient, { schema });

export const useDrizzle = () => db;
