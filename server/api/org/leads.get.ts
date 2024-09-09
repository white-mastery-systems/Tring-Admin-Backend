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
    q: z.string().optional(),
    status: z.string().toLowerCase().optional(),
    action: z.string().optional(),
    channel: z.string().optional(),
    period: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
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
  const timeZoneHeader = event.node?.req?.headers["time-zone"];
  const timeZone = Array.isArray(timeZoneHeader) ? timeZoneHeader[0] : timeZoneHeader || "Asia/Kolkata";
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const query = await isValidQueryHandler(event, queryValidator);

  return await listLeads(organizationId, query, timeZone);
});
