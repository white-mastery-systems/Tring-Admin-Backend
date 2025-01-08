import { userOTPSchema } from "~/server/schema/auth"
import { otpEmailTemplate } from "~/server/utils/email-templates"

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

  const emailTemplate = otpEmailTemplate(otpNumber)
  
  sendEmail(body?.email, "Verify Your Tringlabs Account with OTP", emailTemplate)
 
  return { status: true, message: "OTP sent to your email!" }
})