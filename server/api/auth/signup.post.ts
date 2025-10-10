import { errorResponse } from "~/server/response/error.response";

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    username: z.string(),
    email: z.string(),
    password: z.string()
  }))

  if (body.username.length > 64) {
    return errorResponse(event, 400, "The username is too long. Maximum allowed is 64 characters.")
  }

  if(body?.password.length > 20) {
    return errorResponse(event, 400, "Password cannot exceed 20 characters.")
  }

  const isUserExists = await ifUserAlreadyExists(body.email);
  if (isUserExists)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Email already registered: Please sign in or use a different email address.",
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
  
  return { 
    status: true, 
    data: user,
    token: lucia.createSessionCookie(session.id).serialize() 
  };
});
