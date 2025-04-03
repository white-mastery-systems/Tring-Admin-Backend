import type { User } from "lucia";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const user = (await useUser()).user as Ref<User>;
  const userDetails = await $fetch("/api/user").catch(() => null);

  // If no user & no stored userData, check API
  if (userDetails && !userDetails.isVerified) {
    return navigateTo("/auth/onboarding/select-bot-power", { replace: true });
  }
  // If no user & no stored userData, check API
  if (!user.value && userDetails && userDetails.isVerified) {
    return navigateTo("/");
  }
  
  if(!user.value && !userDetails){
    return navigateTo("/auth/sign-in", { replace: true });
  }

  if (!user.value) return navigateTo("/auth/sign-in");
});
