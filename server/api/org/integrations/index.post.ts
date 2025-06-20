import { ilike } from "drizzle-orm";
import { toast } from "vue-sonner";
import { logger } from "~/server/logger";
import { checkIntegrationNameAlreadyExists, createIntegration } from "~/server/utils/db/integrations";
import {
  fetchPhoneNumbers,
  fetchSubscribedApps,
  getSharedWhatsappDetails,
  subscribeApp,
} from "~/server/utils/whatsapp/module";

enum CRMType {
  sellDo = "sell-do",
  zohoCRM = "zoho-crm",
  zohoBigin = "zoho-bigin",
  whatsapp = "whatsapp",
  hubspot = "hubspot",
  slack = "slack",
  shopify = "shopify",
  zohoCliq = "zoho-cliq",
  reserveGo = "reserve-go",
  zohoDesk = "zoho-desk",
  SalesHandy = "sales-handy"
}
const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const zodInsertIntegration = z
    .object({
      name: z.string().min(3, "Integration should have atleast 3 characters"),
      crm: z.nativeEnum(CRMType),
      type: z.string(),
      metadata: z.object({
        apiKey: z.string().optional(),
        phoneNumber: z.string().optional(),
        countryCode: z.string().optional(),
        status: z.string().optional(),
        pid: z.string().optional(),
        code: z.string().optional(),
        access_token: z.string().optional(),
        wabaId: z.string().optional(),
        wabaName: z.string().optional(),
        pidPhoneNumber: z.string().optional(),
        pidName: z.string().optional(),
        businessName: z.string().optional(),
        businessId: z.string().optional(),
        pin: z.string().optional(),
        stage: z.string().optional(),
        channelId: z.string().optional(),
      }),
    })
    .refine(
      async (data) => {
        const existing = await checkIntegrationNameAlreadyExists(organizationId, data.name, "insert")
        if (existing) {
          return false;
        }
        return true;
      },
      {
        message: "Integration name already exists",
      },
    );
  const userId: { id: string } = event.context.user!;
  const body = await isValidBodyHandler(event, zodInsertIntegration);

  //TODO :add this
  let response: Record<string, any> = {};
  if (body.crm === "whatsapp" && body.metadata?.code && !body.metadata?.access_token) {
    try {
      response = await $fetch(
        "https://graph.facebook.com/v21.0/oauth/access_token",
        {
          method: "POST",
          body: {
            client_id: "3404499776522072",
            client_secret: "696e6112fe8aafca3e3ccf9332273140",
            code: body.metadata.code,
            grant_type: "authorization_code",
          },
          headers: { "Content-Type": "application/json" },
        },
      );
      logger.info(`Response: ${JSON.stringify(response)}`);
      try {
        if (body?.metadata?.wabaId && response?.access_token) {
          await subscribeApp({
            code: response?.access_token,
            wabaId: body.metadata?.wabaId,
          });
          try {
            logger.info(
              `Registered Phone: pid ${body.metadata.pid}, access_token ${response?.access_token}, pin ${body.metadata?.pin}, metadata ${JSON.stringify(body.metadata)}`,
            );
            const registerPhone = await $fetch(
              `https://graph.facebook.com/v23.0/${body.metadata.pid}/register`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${response?.access_token}` },
                body: {
                  messaging_product: "whatsapp",
                  pin: body.metadata?.pin ?? "000000",
                },
              },
            );
            logger.info(
              `Registered Phone Response: ${JSON.stringify(registerPhone)}`,
            );
            toast("Phone registered successfully!");
          } catch (err) {
            logger.info(`Registered Phone Error ${JSON.stringify(err)}`);
            toast(
              "Failed to register phone. Please ensure 2FA is enabled for the owner.",
            );
           return createError({
             statusCode: 400,
             statusMessage:
               "2FA Failed: Ensure you are using the correct 2FA details of the account owner. Double-check the credentials and try again.",
           });
          }
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err: any) {}
  }

  const integration = await createIntegration({
    ...body,
    metadata: {
      ...body.metadata,
      ...response,
      // ...sharedBuisnessResponse,
      // ...subscribeResponse,
    },
    org_id: organizationId,
    user_id: userId?.id,
  });
  return integration;
});
