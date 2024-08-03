/**
 * The middleware populates whether the user is authenticated or not
 */
export default defineNuxtRouteMiddleware(async (_to) => {
  if (import.meta.server) return;

  const { user } = await useUser();
});
