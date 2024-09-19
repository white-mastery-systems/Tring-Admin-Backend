import { ilike } from "drizzle-orm";
import { createIntegration } from "~/server/utils/db/integrations";

enum CRMType {
  sellDo = "sell-do",
  zohoCRM = "zoho-crm",
  zohoBigin = "zoho-bigin",
  whatsapp = "whatsapp",
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
  console.log(
    JSON.stringify({
      body: {
        client_id: "3404499776522072",
        client_secret: "696e6112fe8aafca3e3ccf9332273140",
        code: body.metadata.code,
        // code: "AQA7F2u8jm0xcX5yVean1SPsW4QljX8kxLkJE03sW7Uwzgtoz9gyGT4xIXCYda8FoobbtL2mkOWBbll-Z5sKZs9PS4jyv0wdI6cAuf7hzpT8kxlrwM8_NkgnuHDBCsjaEnjafG1vIgLpVSOwAQ4tJl2nS9W-OLT_9geqMuQS6VQdnbsO4nL7FkBZSuKqrLaPgok6PQECAmvj58jcTduU207Wf5l1IwaDD1u61mPUIpLI2AtX7h4i2vWlQwMv4K0_zIsKkfjpmyRurksHU0lAffYg7ocdl3P5FyUpDZJHmOGyqIn8viHKXFnBryBVYNUcgAa5VS8xzsMV-LrtM0pdNqiidQ4-rVxFyM5mFGmfasn4TrvPPcO18dGjIOfurAjs4nkrkLp_MG6V5e37oGQGOPXc",
        grant_type: "authorization_code",
        redirect_uri:
          "https://6t53p9kf-3000.inc1.devtunnels.ms/settings/integration/meta-oauth",
      },
    }),
  );
  const response = await $fetch(
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
  // "redirect_uri": "https://developers.facebook.com/es/oauth/callback/?business_id=1388671167900969&nonce=6xTLiGRkpNth3wd9TLxUt62VnSe8tVN3"

  // const data = await response.json();
  console.log({ response: JSON.stringify(response) });
  const integration = await createIntegration({
    ...body,
    metadata: { ...body.metadata, ...response },
    org_id: organizationId,
    user_id: userId?.id,
  });
  return integration;
});
