import { v4 as uuid } from "uuid";
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

  if (!user.isVerified) {
    const otpNumber = Math.floor(1000 + Math.random() * 9000);

    await db
      .update(userOTPSchema)
      .set({
        otp: {
          otpNumber: otpNumber.toString(),
          timestamp: new Date(),
          status: "pending",
        },
      })
      .where(eq(userOTPSchema.userId, user?.id));

    const emailTemplate = otpEmailTemplate(otpNumber);

    sendEmail(
      user?.email,
      "Verify Your Tringlabs Account with OTP",
      emailTemplate,
    );
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "User not verified. Please verify your account to proceed.",
        data: user,
      }),
    );
  }

  if(!user.username) {
     return sendError(event, createError({
       statusCode: 400,
       statusMessage: "Onboarding process is incomplete. Please provide your details to proceed."
     }))
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

  return {
    status: true,
    data: {
      username: user?.username,
      email: user?.email,
    },
    token: lucia.createSessionCookie(session.id).serialize()
  };
});
