import { userOTPSchema } from "~/server/schema/auth";
import { otpEmailTemplate } from "~/server/utils/email-templates";

const config = useRuntimeConfig();

const db = useDrizzle();

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    username: z.string(),
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

  const otpNumber = Math.floor(1000 + Math.random() * 9000);

  await db.insert(userOTPSchema).values({
    userId: user?.id,
    otp: {
      otpNumber: otpNumber.toString(),
      timestamp: new Date(),
      status: "pending",
    },
  });

  const emailTemplate = otpEmailTemplate(otpNumber);

  sendEmail(
    user?.email,
    "Verify Your Tringlabs Account with OTP",
    emailTemplate,
  );

  if (user.organizationId) return "/";
  // return "/auth/onboarding/1";
  return { status: true, message: "OTP sent to your email!", data: user,  token: lucia.createSessionCookie(session.id).serialize() };
});
