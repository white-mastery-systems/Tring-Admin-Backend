import { ilike } from "drizzle-orm";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  const body: any = await readBody(event)

  const orgDetails = await getOrganizationById(organizationId)

  // const zodInsertChatBot = z
  //   .object({
  //     name: z
  //       .string()
  //       .optional(),
  //     type: z.string().optional(),
  //     integrationId: z.string().optional(),
  //   })
    // .refine(
    //   (data) => {
    //     if (data.type === "ecommerce" && !data?.integrationId) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   {
    //     message: "Other role must be provided",
    //     path: ["otherRole"],
    //   },
    // )
    // .refine(
    //   async (data) => {
    //     const isBotExisting = await db.query.chatBotSchema.findFirst({
    //       where: and(
    //         eq(chatBotSchema.organizationId, organizationId),
    //         ilike(chatBotSchema.name, data?.name),
    //       ),
    //     });
    //     if (isBotExisting) {
    //       return false;
    //     }
    //     return true;
    //   },
    //   {
    //     message: "Bot name already exists",
    //   },
    // );

  // Validate Body
  // const body = await isValidBodyHandler(event, zodInsertChatBot);
  const randomBotName = generateRandomBotName(orgDetails?.name!)

  const bot = await createBot({
    name: body?.name ?? randomBotName,
    type: body?.type ?? "others",
    organizationId,
  });

  return bot;
});


const generateRandomBotName = (orgName: string) => {
  const defaultName = `${orgName} - chat bot - ${Math.floor(100 + Math.random() * 900)}`;
  return defaultName
}