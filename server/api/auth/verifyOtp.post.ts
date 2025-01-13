import { v4 as uuid } from "uuid";
import { userOTPSchema } from "~/server/schema/auth"

const db = useDrizzle()

const zodOtpValidator = z.object({
  userId: z.string(),
  otp: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, zodOtpValidator)

  const userOTP : any = await db.query.userOTPSchema.findFirst({
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
     return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "OTP expired",
      }),
    )
  }

  if (userOTP.otp?.otpNumber !== body.otp) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid OTP",
      }),
    )
  }

  // OTP is valid, mark it as verified in the database
  
    await db.update(userOTPSchema)
      .set({ 
        otp: {
          ...userOTP.otp,
          status: "verified"
        } 
      }).where(eq(userOTPSchema.userId, body.userId))

   const user = (await db.update(authUserSchema)
      .set({
       isVerified: true
      }).where(eq(authUserSchema.id, body.userId)).returning())[0]
  

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
  
  return { success: true, message: "OTP verified successfully" };
})