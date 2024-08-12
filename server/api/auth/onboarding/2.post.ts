const bodyValidationSchema = z.object({
  name: z.string().min(1),
  industry: z.string().min(1),
  avgTraffic: z.string().min(1),
  employeeCount: z.string().min(1),
});
export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, bodyValidationSchema);

  const userId = event.context.user?.id;
  if (!userId)
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: "Invalid User" }),
    );

  const org = await createOrganization({
    name: body.name,
    metadata: {
      industry: body.industry,
      avgTraffic: body.avgTraffic,
      employeeCount: body.employeeCount,
    },
  });

  await updateUser(userId, {
    organizationId: org.id,
  });
});
