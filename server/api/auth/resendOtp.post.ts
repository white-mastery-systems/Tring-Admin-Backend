import { userOTPSchema } from "~/server/schema/auth"

const db = useDrizzle()

const zodEmailValidator = z.object({
  email: z.string()
})

export default defineEventHandler(async (event) =>{
  const body = await isValidBodyHandler(event, zodEmailValidator)

  const userData = await db.query.authUserSchema.findFirst({
    where: eq(authUserSchema.email, body.email)
  })

  if(!userData) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Incorrect email",
      }),
    )
  }
  const otpNumber = Math.floor(1000 + Math.random() * 9000)

  await db.update(userOTPSchema)
  .set({
    otp: {
      otpNumber: otpNumber.toString(),
      timestamp: new Date(),
      status: "pending"
    }
  })
  .where(eq(userOTPSchema.userId, userData?.id))

  sendEmail(body?.email, "Tring admin - OTP", `Your one-time password (OTP) for verifying your account is: ${otpNumber}. This OTP is valid for 10 minutes.`)

  return { status: true, message: "OTP sent to your email!" }
})