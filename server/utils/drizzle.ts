import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { adminSubscriptionSchema, campaignWhatsappContactSchema, contactGroupLinkSchema, contactGroupSchema, contactListAndContactsRelations, contactListContactsSchema, industriesSchema, orgSubscriptionSchema, playgroundDocumentSchema, templateRelations, voicebotContactSchema, voiceBucketContactsRelations, voiceContactLinkSchema, whatsappSessionSchema, zohoBillingCreditSchema } from "../schema/admin";
import { userOTPSchema } from "../schema/auth";
import { callLogsRelations, outboundCallSchema, salesHandyContactsSchema, voicebotCallRelations, voicebotIntegrationRelations, voicebotLeadRelations, voicebotLeadSchema, voicebotRelations, voicebotSchedularSchema, voicebotScheduledCallsRelations } from "../schema/voicebot";
import { botDynamicFormSchema, chatResponseImprovementSchema } from "../schema/bot";

const config = useRuntimeConfig()

const queryClient = new pg.Pool({ connectionString: config.dbUrl });

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
  voicebotSchedularSchema,
  voicebotLeadSchema,
  whatsappSessionSchema,
  campaignWhatsappContactSchema,
  ttsIntegrationSchema,
  //new schemas
  adminSubscriptionSchema,
  adminPlanUsageSchema,
  chatbotScheduledCallSchema,
  chatResponseImprovementSchema,
  industriesSchema,
  contactProfileSchema,
  voicebotDocumentSchema,
  contactGroupSchema,
  contactGroupLinkSchema,
  newCampaignSchema,
  voicebotCallScheduleSchema,
  zohoBillingCreditSchema,
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
  voiceBucketContactsRelations,
  voicebotLeadRelations,
  voicebotScheduledCallsRelations,
  salesHandyContactsSchema,
  whatsappEnrichmentSchema,
  whatsappEnrichmentRelations,
  templateRelations,
  voicebotCallRelations,
  contactGroupLinkRelations
};

const db = drizzle(queryClient, { schema });

export const useDrizzle = () => db;
