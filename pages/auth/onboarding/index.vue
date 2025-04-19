<script setup lang="ts">
import UserProfileForm from '~/components/auth/UserProfileForm.vue';

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
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <img class="self-center" src="assets\icons\Tring-Ai-Logo-with-black-text.png" width="190" height="190" />
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            <!-- &ldquo; -->
            AI-powered Chat and Voice Agents.
            <!-- &rdquo; -->
          </p>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Complete your profile!
          </h1>
        </div>
        <UserProfileForm />
        <p class="px-8 text-center text-sm text-muted-foreground" v-if="false">
          By Signing up, I Agree to Tring AI
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
