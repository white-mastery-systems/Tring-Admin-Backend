const queryValidator = z
  .object({
    botId: z.string().optional(),
    from: z
      .string()
      .datetime({ offset: true })
      .nullish()
      .transform((val) => (val ? new Date(val) : null)),
    to: z
      .string()
      .datetime({ offset: true })
      .nullish()
      .transform((val) => (val ? new Date(val) : null)),
  })
  .refine(
    (data) => {
      if (data.from === null && data.to === null) {
        return true;
      }
      return data.from !== null && data.to !== null;
    },
    {
      message:
        "Both 'from' and 'to' must be present if either is provided, or both must be omitted.",
    },
  );
export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = await isValidQueryHandler(event, queryValidator);

  return await listLeads(organizationId, query);
});
