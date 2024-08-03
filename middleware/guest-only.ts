import type { AuthRoles } from "@/utils/auth";
import type { User } from "lucia";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const user = (await useUser()).user as Ref<User>;

  if (user.value) {
    return authHandlers.redirectToRoleHome(user.value.role as AuthRoles);
  }
});
