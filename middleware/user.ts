import type { User } from "lucia";

export default defineNuxtRouteMiddleware(async (_to) => {
  if (import.meta.server) return;

  const user = (await useUser()).user as Ref<User>;

  if (!user.value) return navigateTo("/auth/sign-in");
});
