import { ilike } from "drizzle-orm";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;
  // name: (schema) =>
  //   schema.name.min(3, "Name Too Short").max(64, "Name Too Long"),
  const zodInsertChatBot = z
    .object({
      name: z.string().min(3, "Name Too Short").max(64, "Name Too Long"),
    })
    .refine(
      async (data) => {
        const isBotExisting = await db.query.chatBotSchema.findFirst({
          where: and(
            eq(chatBotSchema.organizationId, organizationId),
            ilike(chatBotSchema.name, data.name),
          ),
        });
        if (isBotExisting) {
          return false;
        }
        return true;
      },
      {
        message: "Bot name already exists",
      },
    );

  // Validate Body
  const body = await isValidBodyHandler(event, zodInsertChatBot);
  console.log({ body });
  // const body = await readValidatedBody(
  //   event,
  //   zodInsertChatBot.omit({ organizationId: true }).safeParse,
  // );
  // if (!body.success)
  //   return sendError(
  //     event,
  //     createError({
  //       statusCode: 400,
  //       statusMessage: "Invalid body",
  //       data: body.error.format(),
  //     }),
  //   );

  const bot = await createBot({
    ...body,
    organizationId,
  });

  return bot;
});
