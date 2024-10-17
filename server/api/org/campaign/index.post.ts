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
  templateId: z.string().optional(),
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
    where: and(
      eq(contactSchema.organizationId, data.organizationId),
      eq(contactSchema.phone, "8848083317"),
    ),
  });
  console.log(contactList, "contactList");
  const templateData = await db
    .select()
    .from(templateSchema)
    .where(eq(templateSchema.id, data.templateId))
    .leftJoin(
      integrationSchema,
      eq(integrationSchema.id, templateSchema.integrationId),
    );
  console.log(templateData, "templateData");
  scheduleEvent(
    data?.campaignDate,
    data?.campaignTime,
    contactList,
    body,
    templateData[0],
  );
  // const job = await campaignQueue.add(
  //   {
  //     campaignId: data?.id,
  //     campaignDate: data?.campaignDate,
  //     campaignTime: data?.campaignTime,
  //     contactList,
  //     body,
  //     templateData: templateData[0],
  //   },
  //   // { delay: 5000 }
  // );
  // logger.info(
  //   `Job (id: ${job.id}, CampaignId - ${data?.id}) added at: ${new Date()}`,
  // );

  return data;
});
