export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Bad Request: No active session found to sign out.",
      }),
    );
  }
  await lucia.invalidateSession(event.context.session.id);
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createBlankSessionCookie().serialize(),
  );
  return { status: true }
});
