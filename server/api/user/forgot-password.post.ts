import jwt from "jsonwebtoken"
import { updatePassword } from "~/server/utils/db/user"

const config = useRuntimeConfig()

const zodBodyValidator = z.object({
  newPassword: z.string(),
  confirmPassword: z.string()
})

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const token = query?.token as string
  let isValidToken;
  try {
    isValidToken = jwt.verify(token, config.secretKey)
  } catch(error) {
     return sendError(
       event,
       createError({
         statusCode: 400,
         statusMessage:
           "Link Expired: The requested link has expired. Please request a new link to proceed.",
       }),
     );
  }
  
 const body = await isValidBodyHandler(event, zodBodyValidator);
  
  // Ensure `isValidToken` is defined and contains `userId`
  if (!isValidToken?.userId) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid Token: The provided token is invalid or expired. Please verify your token and try again.",
      }),
    );
  }

  const update = await updatePassword(isValidToken.userId, body);

  return update;
})