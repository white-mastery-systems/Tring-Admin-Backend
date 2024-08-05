export default defineEventHandler(async (event) => {
  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  // Validate Body
  const body = await readValidatedBody(
    event,
    zodInsertChatBot.omit({ organizationId: true }).safeParse,
  );
  if (!body.success)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid body",
        data: body.error.format(),
      }),
    );

  const bot = await createBot({
    ...body.data,
    organizationId,
  });

  return bot;
});
