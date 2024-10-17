import { userOTPSchema } from "~/server/schema/auth";

const config = useRuntimeConfig();

const db = useDrizzle()

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body: any) =>
    zodSignUpSchema.safeParse({ ...body, role: "user" }),
  );

  if (body.success === false)
    return sendError(
      event,
      createError({
        statusCode: 400,
        message: "Invalid User Data",
        data: body.error.format(),
      }),
    );

  debugger;

  const isUserExists = await ifUserAlreadyExists("", body.data.email);
  if (isUserExists)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "User already exists",
      }),
    );

  const user = await createUser({
    email: body.data.email,
    password: body.data.password,
    role: "admin",
  });

  // console.log({ user: user.id })

  // const accessToken = jwt.sign({ id: user.id }, config.secretKey, { expiresIn: "1h"})
  // const refreshToken = jwt.sign({ id: user.id }, config.secretKey, { expiresIn: "1d"})

  // console.log({ accessToken, refreshToken })

  // setCookie(event, 'refreshToken', refreshToken, {
  //   httpOnly: true,
  //   sameSite: 'strict',
  // });

  // appendHeaders(event, {
  //   Authorization: accessToken
  // });
  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );
  setResponseStatus(event, 201);

  const otpNumber = Math.floor(1000 + Math.random() * 9000)

  await db.insert(userOTPSchema).values({
    userId: user?.id,
    otp: {
      otpNumber: otpNumber.toString(),
      timestamp: new Date(),
      status: "pending"
    }
  })

  sendEmail(user?.email, "Tring admin - OTP", `Your one-time password (OTP) for verifying your account is: ${otpNumber}. This OTP is valid for 10 minutes.`)

  if (user.organizationId) return "/";
  // return "/auth/onboarding/1";
   return { status: true, message: "OTP sent to your email!", data: user }
});
