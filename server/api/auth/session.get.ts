export default defineEventHandler((event) => {
  const user = event.context.user;
  if(!user) {
     return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage:
          "Unauthorized: You must be an admin to access this resource.",
      }),
    );
  }
  return user
})