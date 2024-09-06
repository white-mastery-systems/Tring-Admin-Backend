const zodQueryValidator = z.object({
  active: z.string().optional(),
  q: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  // const query = getQuery(event);
  const query = await isValidQueryHandler(event, zodQueryValidator)
  console.log({ queryValues: query })
  return await listBots(organizationId, query);
});
