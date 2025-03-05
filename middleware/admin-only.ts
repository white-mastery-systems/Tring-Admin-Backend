import { AuthRoles } from "@/utils/auth";
import type { User } from "lucia";

export default defineNuxtRouteMiddleware(async (_to) => {
  if (import.meta.server) return;

  const user = (await useUser()).user as Ref<User>;
  if (!user.value) {
    if (((_to.name === "analytics-leads-id") || (_to.name === "analytics-chats-id") || (_to.name === "analytics-call-logs-id")) && _to.params.id) {
      useState('layout', () => 'signUpSuccess')
      return
    }
     else return navigateTo("/auth/sign-in");
  }
  // if (!user.value) return navigateTo("/auth/sign-in");
  // if (user.value.role !== AuthRoles.Admin) {
  //   return authHandlers.redirectToRoleHome(user.value.role as AuthRoles);
  // }
});
