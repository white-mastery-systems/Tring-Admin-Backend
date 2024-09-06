export default defineEventHandler(async(event) => {
  const userId = event.context.user?.id as string
  await isOrganizationAdminHandler(event);

  const userDetails = await getUserById(userId)

  return userDetails
});
