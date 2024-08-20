import { ilike } from "drizzle-orm";
import { createIntegration } from "~/server/utils/db/integrations";

enum CRMType {
  SellDo = "sell-do",
}
const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const zodInsertIntegration = z
    .object({
      name: z.string().min(3, "Intent should have atleast 3 characters"),
      crm: z.nativeEnum(CRMType),
      metaData: z.object({
        apiKey: z.string().min(1, "API key minimum length is 2"),
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
  console.log({ body });
  const integration = await createIntegration({
    ...body,
    metadata: body.metaData,
    org_id: organizationId,
    user_id: userId?.id,
  });
  return integration;
});
