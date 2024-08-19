import { createIntegration } from "~/server/utils/db/integrations";

export const zodInsertIntegration = z.object({
  name: z.string().min(2, "Intent too short"),
  metaData: z.object({
    apiKey: z.string().min(1, "API key minimum length is 2"),
  }),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const userId: { id: string } = event.context.user!;
  const body = await isValidBodyHandler(event, zodInsertIntegration);
  console.log({ body });
  const integration = await createIntegration({
    ...body,
    metadata: body.metaData,
    org_id: organizationId,
    user_id: userId?.id,
  });
  return integration;
});
