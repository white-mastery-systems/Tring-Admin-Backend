import {
  listLastCreatedIntegrationByCRM,
  updateIntegrationById,
} from "~/server/utils/db/integrations";

enum CRMType {
  sellDo = "sell-do",
  zohoCRM = "zoho-crm",
  zohoBigin = "zoho-bigin",
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
      location: z.string().optional(),
      accountsServer: z.string().optional(),
    }),
  });

  const userId: { id: string } = event.context.user!;
  const body = await isValidBodyHandler(event, zodInsertIntegration);
  console.log({ body });
  const integration = await listLastCreatedIntegrationByCRM(
    organizationId,
    body.crm,
  );
  const generatedAuthResponse: any = await $fetch(
    `https://accounts.zoho.in/oauth/v2/token?client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&grant_type=authorization_code&client_secret=922f18d9e0d820fbebb9d93fee5cc8201e58fbda8c&redirect_uri=${config.redirectUrl}/${body.crm}&code=${body.metadata.code}`,
    { method: "POST" },
  );

  //accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline
  https: if (!integration) {
    return integration;
  }
  if (!generatedAuthResponse) {
    return generatedAuthResponse;
  }
  const updatedIntegration = await updateIntegrationById(integration.id, {
    ...body,
    ...generatedAuthResponse,
    status: "verified",
  });

  return updatedIntegration;
});
