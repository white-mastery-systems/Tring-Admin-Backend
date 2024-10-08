import { ilike } from "drizzle-orm";
import { logger } from "~/server/logger";
import { createIntegration } from "~/server/utils/db/integrations";
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
}
const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const zodInsertIntegration = z
    .object({
      name: z.string().min(3, "Intent should have atleast 3 characters"),
      crm: z.nativeEnum(CRMType),
      metadata: z.object({
        apiKey: z.string().optional(),
        status: z.string().optional(),
        pid: z.string().optional(),
        code: z.string().optional(),
        wabaId: z.string().optional(),
        pin: z.string().optional(),
      }),
    })
    .refine(
      async (data) => {
        const isBotExisting = await db.query.integrationSchema.findFirst({
          where: and(
            eq(integrationSchema.org_id, organizationId),
            ilike(integrationSchema.name, data.name),
          ),
        });
        if (isBotExisting) {
          return false;
        }
        return true;
      },
      {
        message: "Bot name already exists",
      },
    );
  const userId: { id: string } = event.context.user!;
  const body = await isValidBodyHandler(event, zodInsertIntegration);

  //TODO :add this
  let response: Record<string, any> = {};
  if (body.crm === "whatsapp") {
    try {
      response = await $fetch(
        "https://graph.facebook.com/v20.0/oauth/access_token",
        {
          method: "POST",
          body: {
            client_id: "3404499776522072",
            client_secret: "696e6112fe8aafca3e3ccf9332273140",
            code: body.metadata.code,
            grant_type: "authorization_code",
            // redirect_uri:
            //   "https://6t53p9kf-3000.inc1.devtunnels.ms/settings/integration/meta-oauth",
          },
          headers: { "Content-Type": "application/json" },
        },
      );
      try {
        if (body?.metadata?.wabaId && response?.access_token) {
          console.log("here we are");
          await getSharedWhatsappDetails({
            code: response?.access_token,
            id: body.metadata.wabaId,
          });
          await fetchPhoneNumbers({
            code: response?.access_token,
            id: body.metadata.wabaId,
          });
          if (body.metadata.pid)
            await subscribeApp({
              code: response?.access_token,
              id: body.metadata.pid,
            });
          await fetchSubscribedApps({
            code: response?.access_token,
            id: body.metadata.wabaId,
          });
          try {
            const registerPhone = await $fetch(
              `https://graph.facebook.com/v20.0/${body.metadata.pid}/register`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${response?.access_token}` },
                body: {
                  messaging_product: "whatsapp",
                  pin: body.metadata.pin,
                },
              },
            );
            logger.info(`registed phone ${JSON.stringify(registerPhone)}`);
            console.log({ registerPhone });
          } catch (err) {
            logger.info(`registed phone err ${JSON.stringify(err)}`);
          }
        }
      } catch (err) {
        console.log(err);
      }
      console.log({ code: body.metadata.code });
    } catch (err: any) {
      console.log(err.message, err.data, "ERR");
    }
  }
  // console.log({ response });

  // const url =
  //   `https://graph.facebook.com/v20.0/${body.metadata.wabaId}` +
  //   "?fields=id,name,currency,owner_business_info" +
  //   `&access_token=${body.metadata.code}`;
  // const sharedBuisnessResponse: Record<string, any> = await $fetch(url, {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });

  // console.log({ registerPhone });
  // const subscribeResponse = await fetch(
  //   `https://graph.facebook.com/v20.0/${body.metadata.wabaId}/subscribed_apps`,
  //   {
  //     method: "POST",
  //     body: JSON.stringify({
  //       access_token: body.metadata.access_token,
  //     }),
  //     headers: { "Content-Type": "application/json" },
  //   },
  // );
  // console.log({ subscribeResponse });

  // const data = await response.json();
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
