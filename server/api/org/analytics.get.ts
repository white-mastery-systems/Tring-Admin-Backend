const queryValidator = z.object({
  period: z.string(),
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
  graphValues: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const validatedQuery = await isValidQueryHandler(event, queryValidator);

  //
  return await getAnalytics(
    organizationId,
    validatedQuery?.period,
    validatedQuery?.from,
    validatedQuery?.to,
    validatedQuery?.graphValues,
  );
});
