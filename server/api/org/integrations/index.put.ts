import {
  listLastCreatedIntegrationByCRM,
  updateIntegrationById,
} from "~/server/utils/db/integrations";
import { getHubspotAccessToken } from "~/server/utils/hubspot/auth";
import { generateAccessTokenFromCodeForShopify } from "~/server/utils/shopify/auth";
import { generateAccessTokenFromCodeForSlack } from "~/server/utils/slack/auth";
import { generateCliqAccessToken } from "~/server/utils/zoho/cliq/auth";

enum CRMType {
  sellDo = "sell-do",
  zohoCRM = "zoho-crm",
  zohoBigin = "zoho-bigin",
  hubspot = "hubspot",
  slack = "slack",
  shopify = "shopify",
  zohoCliq = "zoho-cliq",
  reserveGo = "reserve-go",
}
const db = useDrizzle();
const config = useRuntimeConfig();
export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const zodInsertIntegration = z.object({
    crm: z.nativeEnum(CRMType),
    metadata: z.object({
      apiKey: z.string().optional(),
      code: z.string().optional(),
      shop: z.string().optional(),
      location: z.string().optional(),
      accountsServer: z.string().optional(),
      stage: z.string().optional(),
      channelId: z.string().optional()
    }),
  });

  const userId: { id: string } = event.context.user!;
  const body = await isValidBodyHandler(event, zodInsertIntegration);

  // return { body }
  //
  const integration = await listLastCreatedIntegrationByCRM(
    organizationId,
    body.crm,
  );
  let generatedAuthResponse: any = null;
  if (body.crm === "hubspot") {
    const data = await getHubspotAccessToken({
      redirectUri: `${config.redirectUrl}/hubspot`,
      authCode: body.metadata.code,
    });

    generatedAuthResponse = data.response;
  } else if (body.crm === "slack" && body.metadata.code) {
    // code=1234 -F client_id=3336676.569200954261 -F client_secret=ABCDEFGH https://slack.com/api/oauth.v2.access
    const data = await generateAccessTokenFromCodeForSlack({
      code: body.metadata.code,
    });

    generatedAuthResponse = data;
  } else if (
    body.crm === "shopify" &&
    body.metadata.code &&
    body.metadata.shop
  ) {
    const data = await generateAccessTokenFromCodeForShopify({
      code: body.metadata.code,
      shop: body.metadata.shop,
    });

    generatedAuthResponse = data;
  } else if (body.crm === "zoho-bigin" || body.crm === "zoho-crm") {
    generatedAuthResponse = await $fetch(
      `https://accounts.zoho.in/oauth/v2/token?client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&grant_type=authorization_code&client_secret=922f18d9e0d820fbebb9d93fee5cc8201e58fbda8c&redirect_uri=${config.redirectUrl}/${body.crm}&code=${body.metadata.code}`,
      { method: "POST" },
    );
  } else if (body.crm === "zoho-cliq") {
    const data = await generateCliqAccessToken(body, config)
    generatedAuthResponse = data
  }

  // https: accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline
  if (!integration) {
    return integration;
  }
  if (!generatedAuthResponse) {
    return generatedAuthResponse;
  }
  const updatedIntegration = await updateIntegrationById(integration.id, {
    ...body,
    metadata: {
      ...body.metadata,
      ...generatedAuthResponse,
    },
    status: "verified",
  });
  // const blabla = await createContactInHubspot({
  //   token: generatedAuthResponse.access_token,
  //   refreshToken: generatedAuthResponse.refresh_token,
  //   body: {
  //     properties: {
  //       properties: {
  //         email: "example@hubspot.com",
  //         firstname: "Jane",
  //         lastname: "Doe",
  //         phone: "(555) 555-5555",
  //         company: "HubSpot",
  //         website: "hubspot.com",
  //         lifecyclestage: "marketingqualifiedlead",
  //       },
  //     },
  //   },
  //   integrationData: {
  //     ...updatedIntegration,
  //   },
  // });
  //
  return updatedIntegration;
});
