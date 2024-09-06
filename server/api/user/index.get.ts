export default defineEventHandler(async(event) => {
  const userId = event.context.user?.id as string

  const userDetails = await getUserById(userId)

  return userDetails
});
