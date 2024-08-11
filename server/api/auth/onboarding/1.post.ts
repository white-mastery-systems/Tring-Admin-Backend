const bodyValidationSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
});
export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, bodyValidationSchema);

  const userId = event.context.user?.id;
  if (!userId)
    return sendError(
      event,
      createError({ statusCode: 404, statusMessage: "Invalid User" }),
    );

  await updateUser(userId, {
    username: body.name,
    metadata: {
      role: body.role,
    },
  });
});
