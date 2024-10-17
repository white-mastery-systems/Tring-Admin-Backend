import { userOTPSchema } from "~/server/schema/auth"

const db = useDrizzle()

const zodOtpValidator = z.object({
  userId: z.string(),
  otp: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, zodOtpValidator)

  const userOTP = await db.query.userOTPSchema.findFirst({
    where: eq(userOTPSchema.userId,  body.userId)
  })

  if(!userOTP) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invaild user id",
      }),
    )
  }

  const otpCreatedAt = new Date(userOTP.otp.timestamp);
  const currentTime = new Date();
  const diffInMinutes = (currentTime - otpCreatedAt) / (1000 * 60); // Difference in minutes


  if (diffInMinutes > 10) {
    return { success: false, message: "OTP expired" };
  }

  if (userOTP.otp?.otpNumber !== body.otp) {
    return { success: false, message: "Invalid OTP" }
  }

  // OTP is valid, mark it as verified in the database
  await Promise.all([
    db.update(userOTPSchema)
      .set({ 
        otp: {
          ...userOTP.otp,
          status: "verified"
        } 
      }).where(eq(userOTPSchema.userId, body.userId)),

    db.update(authUserSchema)
      .set({
       isVerified: true
      }).where(eq(authUserSchema.id, body.userId))
  ])
  
  return { success: true, message: "OTP verified successfully" };
})