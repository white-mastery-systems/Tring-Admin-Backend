<script setup lang="ts">
import SignUpSuccessIcon from '~/components/icons/SignUpSuccessIcon.vue';
definePageMeta({
  layout: "sign-up-success",
});

const proceedLogin = async () => {
  (await useUser()).refreshUser();
};

</script>

<template>
  <div class="flex flex-col justify-center items-center h-[100%] relative w-full">
    <!-- Logo in the top-left corner -->
    <div class="absolute top-[20px] left-[30px] hidden md:block">
      <img src="assets/icons/tring_AI_logo.svg" width="80" height="80">
    </div>

    <!-- Main success message card -->
    <div
      class="flex flex-col items-center justify-center p-5 field_shadow bg-[#FFFFFF] w-full sm:w-full md:w-[60%] h-[60%]">
      <!-- Success icon in a circular background -->
      <div class="flex items-center justify-center w-[100px] h-[100px] bg-[#424BD1] rounded-full">
        <SignUpSuccessIcon />
      </div>

      <!-- Thank You message -->
      <div class="font-black text-[#424BD1] text-[24px] sm:text-[30px] md:text-[32px] pt-4">
        Welcome to TRING AI
      </div>

      <!-- Success message -->
      <div class="font-bold text-[12px] sm:text-[12px] md:text-[16px] text-[#333333]">
        <!-- Your account has been created successfully. You can log in with your login credentials. -->
        Your Account is Created Successful
      </div>
      <!-- Success message -->
      <div
        class="text-[12px] sm:text-[12px] md:text-[16px] text-[#8A8A8A] my-6 sm:w-[95%] md:w-[60%] text-center font-normal">
        <!-- Your account has been created successfully. You can log in with your login credentials. -->
        You can create a chatbot which consists of 50 free chat sessions on your current plan
      </div>
      <!-- <span>
        Go to my dashboard
      </span> -->
      <UiButton class="bg-[#ffbc42] hover:bg-[#ffbc42] font-semibold text-[12px] sm:text-[12px] md:text-[16px]"
        @click="proceedLogin()">
        Proceed to Dashboard
      </UiButton>
    </div>
  </div>
</template>
