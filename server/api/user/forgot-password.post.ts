import jwt from "jsonwebtoken"
import { updatePassword } from "~/server/utils/db/user"

const config = useRuntimeConfig()

const zodBodyValidator = z.object({
  newPassword: z.string(),
  confirmPassword: z.string()
})

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const token = query?.token

  const isValidToken = jwt.verify(token, config?.secretKey)
  
  const body = await isValidBodyHandler(event, zodBodyValidator)
  
  const update = await updatePassword(isValidToken.userId, body)

  return update
})