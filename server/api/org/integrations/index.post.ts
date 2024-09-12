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
      metaData: z.object({
        apiKey: z.string().optional(),
        status: z.string().optional(),
        pid: z.string().optional(),
        token: z.string().optional(),
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

  const integration = await createIntegration({
    ...body,
    metadata: body.metaData,
    org_id: organizationId,
    user_id: userId?.id,
  });
  return integration;
});
