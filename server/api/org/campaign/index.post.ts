import { logger } from "~/server/logger";

const db = useDrizzle();

const zodInsertCampaign = z.object({
  countryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  campaignDate: z
    .string()
    .datetime({ offset: true })
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
  campaignTime: z
    .string()
    .datetime({ offset: true })
    .nullish()
    .transform((val) => (val ? new Date(val) : null)),
  contactListId: z.string().optional(),
  type: z.string().optional(),
  metadata: z.any(),
});

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const body: any = await isValidBodyHandler(event, zodInsertCampaign);
  console.log({ body });
  const data = await createCampaign({
    ...body,
    organizationId,
  });

  if (!data) {
    return { status: false, message: "Failed to create" };
  }

  const contactList = await db.query.contactSchema.findMany({
    where: eq(contactSchema.contactListId, data.contactListId),
  });
  const integrationData = await db.query.integrationSchema.findFirst({
    where: eq(integrationSchema.id, body.metadata.integrationId),
  });
  console.log(integrationData);
  const schedule = await scheduleEvent(
    data?.campaignDate,
    data?.campaignTime,
    contactList,
    body,
    integrationData,
  );
  if (schedule.status) {
    logger.info({ level: "info", message: "Message scheduled..." });
  }
  return data;
});
