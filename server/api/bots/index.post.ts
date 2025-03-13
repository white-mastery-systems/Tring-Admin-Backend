const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const body: any = await isValidBodyHandler(event, z.object({
    name: z.string().optional(),
    type: z.string().optional(),
    metadata: z.record(z.any()).optional()
  }))

  const orgDetails = await getOrganizationById(organizationId)

  const randomBotName = generateRandomBotName(orgDetails?.name!)

  const payload = {
    name: body?.name ?? randomBotName,
    type: body?.type ?? "others",
    ...(body?.metadata && {
      metaData: {
        ...body.metadata,
        prompt: {
          ...body?.metadata?.prompt
        },
      }
    }),
    organizationId,
  }

  // return payload

  const bot = await createBot(payload);

  return bot;
});


const generateRandomBotName = (orgName: string) => {
  const defaultName = `${orgName} - chat bot - ${Math.floor(100 + Math.random() * 900)}`;
  return defaultName
}