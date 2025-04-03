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

  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );
  setResponseStatus(event, 201);
  
  return { status: true, data: user,  token: lucia.createSessionCookie(session.id).serialize() };
});
