<script setup lang="ts">
import UserOtpVerifyForm from '~/components/auth/UserOtpVerifyForm.vue';

// import { buttonVariants } from '@/lib/registry/new-york/ui/button'
// import { cn } from '@/lib/utils'
// import UserAuthForm from './components/UserAuthFor'
definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});
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
    <!-- <a href="/auth/sign-in" class="absolute right-4 top-4 md:right-8 md:top-8">
      Login
    </a> -->
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100" />
      <div class="relative z-20 flex items-center text-lg font-medium pt-6">
        <img class="self-center" src="assets\icons\Tring-Ai-Logo-with-black-text.png" width="150" height="150" />
      </div>
      <div class="relative z-20 flex items-center justify-center text-lg font-medium mt-12">
        <img class="self-center w-[500px]" src="assets\logo\new-sign-up-logo.png" />
        <!-- AI - powered Chat and voice Agents -->
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Enter Your OTP
          </h1>
          <p class="text-sm text-muted-foreground">
            An OTP has been sent to your email
          </p>
        </div>
        <UserOtpVerifyForm />
        <p class="px-8 text-center text-[13px] text-muted-foreground">
          By clicking continue, you agree to our
          <!-- <a href="/terms" class="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>
          and
          <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a> -->
          <a target="_blank" href="https://tringlabs.ai/terms-conditions"
            class="underline underline-offset-4 hover:text-primary">
            Terms & Conditions
          </a>
          .
        </p>
      </div>
    </div>
  </div>
</template>
