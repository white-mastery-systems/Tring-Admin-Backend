<script setup lang="ts">
import SignUpSuccessIcon from '~/components/icons/SignUpSuccessIcon.vue';

definePageMeta({
  layout: "sign-up-success",
});
</script>

<template>
  <div class="flex flex-col justify-center items-center h-[100%] relative w-full">
    <!-- Logo in the top-left corner -->
    <div class="absolute top-[20px] left-[30px]">
      <img src="assets/icons/tring_AI_logo.svg" width="80" height="80">
    </div>

    <!-- Main success message card -->
    <div class="flex flex-col items-center justify-center p-5 field_shadow bg-[#FFFFFF] w-[60%] h-[60%]">
      <!-- Success icon in a circular background -->
      <div class="flex items-center justify-center w-[100px] h-[100px] bg-[#424BD1] rounded-full">
        <SignUpSuccessIcon />
      </div>

      <!-- Thank You message -->
      <div class="font-bold text-[#424BD1] text-[28px] pt-4">
        Thank You!
      </div>

      <!-- Success message -->
      <div class="font-medium text-[18px]">
        Your account has been created successfully. You can log in with your login credentials.
      </div>
    </div>
  </div>
</template>
