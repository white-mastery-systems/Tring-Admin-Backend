import { v4 as uuid } from "uuid";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body: any) =>
    zodLogin.safeParse(body),
  );

  if (body.success === false)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid User Data",
        data: body.error.format(),
      }),
    );

  const user = await getUserByUsernameAndEmail({ ...body.data });

  if (!user) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Incorrect username or password",
      }),
    );
  }

  // const userData = {
  //   id: user.id,
  //   email: user.email,
  //   organizationId: user.organizationId,
  //   role: user.role,
  // };

  // const accessToken = jwt.sign(userData, config.secretKey, { expiresIn: "1h" });
  // const refreshToken = jwt.sign(userData, config.secretKey);

  // setCookie(event, "refreshToken", refreshToken, {
  //   httpOnly: true,
  //   sameSite: "strict",
  // });

  // appendHeaders(event, {
  //   Authorization: accessToken,
  // });

  const session = await lucia.createSession(
    user.id,
    { email: user.email },
    { sessionId: uuid() },
  );
  // const { accessToken, refreshToken } = await lucia.createTokens(session);
  // setCookie(event, "refresh_token", refreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   path: "/",
  //   maxAge: 60 * 60 * 24 * 7, // 1 week
  // });

  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );
});
