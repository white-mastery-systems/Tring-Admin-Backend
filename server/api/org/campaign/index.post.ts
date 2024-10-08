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
  //

  // bull-queue
  const job = await campaignQueue.add(
    {
      campaignId: data?.id,
      campaignDate: data?.campaignDate,
      campaignTime: data?.campaignTime,
      contactList,
      body,
      integrationData,
    },
    // { delay: 5000 }
  );
  logger.info(
    `Job (id: ${job.id}, CampaignId - ${data?.id}) added at: ${new Date()}`,
  );

  return data;
});
