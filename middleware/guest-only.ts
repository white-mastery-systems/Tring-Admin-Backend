import type { User } from "lucia";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const user = (await useUser()).user as Ref<User>;
  const userDetails = await $fetch("/api/user").catch(() => null);
  const userData = localStorage.getItem("userDetails");

  if (userData === "undefined") {
    localStorage.removeItem("userDetails");
  }

  // if (user.value && !userDetails?.isVerified && "/auth/onboarding/select-bot-power" === to.path) {
  //   // return navigateTo("/auth/onboarding/select-bot-power", {replace: true});
  // }
  // if (user.value && !userDetails?.isVerified && to.path === "/auth/onboarding/billing") {
  //   // return navigateTo("/auth/onboarding/billing")
  // }

  // If user is logged in, prevent access to auth routes
  if (user.value && userDetails?.isVerified && ["/auth/onboarding/select-bot-power", "/auth/onboarding/billing", "/auth/sign-up", "/auth/sign-in", "/auth/forgot-password"].includes(to.path)) {
    return navigateTo("/");
  }

  if (userDetails && !userDetails?.isVerified && ["/auth/sign-up", "/auth/sign-in"].includes(to.path)) {
    return navigateTo("/auth/onboarding/select-bot-power", { replace: true })
  }
  if(user.value && userDetails && ["/auth/sign-up", "/auth/sign-in"].includes(to.path)){
    return navigateTo("/auth/onboarding/select-bot-power", { replace: true });
  }
  
  // If user is not logged in but userData exists, redirect accordingly
  if (!user.value && userData && ["/auth/sign-up", "/auth/sign-in"].includes(to.path)) {
    return navigateTo("/auth/onboarding/select-bot-power", { replace: true });
  }
  
  // If no user & no stored userData, check API
  if (!user.value && !userData && userDetails && !["/auth/onboarding/select-bot-power", "/auth/onboarding/billing"].includes(to.path)) {
    return navigateTo("/auth/onboarding/select-bot-power", { replace: true });
  }
  
  if(!user.value && !userData && !userDetails && ["/auth/onboarding/select-bot-power", "/auth/onboarding/billing"].includes(to.path)){
    return navigateTo("/auth/sign-in", { replace: true });
  }
});
