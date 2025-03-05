export default defineEventHandler(async (event) => {
  const body = await isValidBodyHandler(event, z.object({
    password: z.string()
  }))

  const query = await isValidQueryHandler(event, z.object({
    userId: z.string()
  }))

  const data = await updatePassword(query?.userId, { newPassword: body?.password })

  return data ? { status: true } : { status: false }
})