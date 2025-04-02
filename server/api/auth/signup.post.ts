export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    username: z.string().optional(),
    email: z.string(),
    password: z.string()
  }))

  const isUserExists = await ifUserAlreadyExists(body.email);
  if (isUserExists)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Conflict: A user with this email or username already exists.",
      }),
    );

  const user = await createUser({
    username: body?.username,
    email: body.email,
    password: body.password,
    role: "admin",
  });

  return { status: true, data: user };
});
