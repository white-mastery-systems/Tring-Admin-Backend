import { requestResetPassword } from "~/server/utils/db/user"

const db = useDrizzle()

const zodBodyValidation = z.object({
  email: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, zodBodyValidation)

  const userDetails = await db.query.authUserSchema.findFirst({
    where: 
      eq(authUserSchema.email, body.email)
  })
  if (!userDetails) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "User Not Found: The provided email does not match any registered account. Please check the email and try again.",
      }),
    );
  }
  
  const data = requestResetPassword(userDetails)
  if(!data?.status) {
    return { status: false, message: "Failed to sent email"}
  }
  return { status: true, message: "Email sent successfully"}
})