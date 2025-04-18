<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useRoute } from 'vue-router';
definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const route = useRoute();

const navigateToSignIn = () => {
  navigateTo("/auth/sign-in")
}
</script>

<template>
  <div class="md:flex">
    <VPImage alt="Authentication" width="1280" height="1214" class="block" :image="{
      dark: '/examples/authentication-dark.png',
      light: '/examples/authentication-light.png',
    }" />
  </div>

  <div
    class="container pb-5 sm:pb-5 md:pb-0 relative h-[800px] flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="relative z-20 flex items-center text-lg font-medium pt-6">
        <img class="self-center" src="assets\icons\Tring-Ai-Logo-with-black-text.png" width="150" height="150" />
      </div>
      <div class="relative z-20 flex items-center justify-center text-lg font-medium mt-11">
        <img class="self-center w-[500px]" src="assets\logo\new-sign-up-logo.png" />
      </div>
    </div>
    <div class="lg:p-8">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 w-[350px] sm:w-[350px] md:w-[350px] lg:w-[380px] box_shadow rounded-lg px-6 py-8">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ (!route.query.token) ? 'Forgot Password?' : 'Reset Your Password' }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ (!route.query.token) ? 'Enter your email & send a request' : 'Enter your new password below' }}
          </p>
        </div>
        <ForgotPasswordForm />
        <div v-if="!route.query.token" class="flex w-full items-center justify-center">
          <div class="flex items-center gap-1 text-[#FF9500]" @click="navigateToSignIn">
            <ArrowLeft class="w-4 h-4" />
            <span class="font-medium text-[14px] cursor-pointer">
              Back to Login
            </span>
          </div>
        </div>
        <p v-if="!route.query.token" class="px-0 sm:px-0 md:px-8 text-center text-sm text-muted-foreground">
          By Clicking send request a mail will be sent to reset your password.
        </p>
      </div>
    </div>
  </div>
</template>
