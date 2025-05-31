import { v4 as uuid } from "uuid";
import { errorResponse } from "~/server/response/error.response";
import { otpEmailTemplate } from "~/server/utils/email-templates";

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body: any) =>
    zodLogin.safeParse(body),
  );

  if (body.success === false)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid User Data: The provided user data is not in the expected format.",
        data: body.error.format(),
      }),
    );

  const user = await getUserByUsernameAndEmail({ ...body.data });

  if (!user) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Authentication Failed: Incorrect username or password.",
      }),
    );
  }

  const session = await lucia.createSession(
    user.id,
    { email: user.email },
    { sessionId: uuid() },
  );

  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );

  if(!user.isVerified){
    return errorResponse(event, 400, "Your onboarding is incomplete",  { token: lucia.createSessionCookie(session.id).serialize() })
  }

  if(!user.username) {
     return sendError(event, createError({
       statusCode: 400,
       statusMessage: "Onboarding process is incomplete. Please provide your details to proceed.",
     }))
  }

  return {
    status: true,
    data: {
      username: user?.username,
      email: user?.email,
    },
    token: lucia.createSessionCookie(session.id).serialize()
  };
});
