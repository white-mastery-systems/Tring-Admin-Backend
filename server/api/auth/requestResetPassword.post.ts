// import { requestResetPassword } from "~/server/utils/db/user"

// const db = useDrizzle()

// const zodBodyValidation = z.object({
//   email: z.string()
// })

export default defineEventHandler(async (event) => {
  // const body = await isValidBodyHandler(event, zodBodyValidation)

  // const userDetails = await db.query.authUserSchema.findFirst({
  //   where: 
  //     eq(authUserSchema.email, body.email)
  // })
  // if(!userDetails) {
  //    return sendError(
  //     event,
  //     createError({
  //       statusCode: 400,
  //       statusMessage: "Incorrect email",
  //     }),
  //   );
  // }
  
  // const data = await requestResetPassword(userDetails)

  // return data

})