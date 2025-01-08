import { v4 as uuid } from "uuid";
import { otpEmailTemplate } from "~/server/utils/email-templates";

const db = useDrizzle()

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

  if(!user.isVerified) {
    const otpNumber = Math.floor(1000 + Math.random() * 9000)

    await db.update(userOTPSchema)
    .set({
      otp: {
        otpNumber: otpNumber.toString(),
        timestamp: new Date(),
        status: "pending"
      }
    }).where(eq(userOTPSchema.userId, user?.id))

    const emailTemplate = otpEmailTemplate(otpNumber)

    sendEmail(user?.email, "Verify Your Tringlabs Account with OTP", emailTemplate)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "User not verified",
        data: user
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

 return { 
    status: true, 
    data: {
      username: user?.username,
      email: user?.email
    } 
  }
});
