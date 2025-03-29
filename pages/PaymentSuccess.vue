<template>
  <div class="flex flex-col justify-center items-center h-[100%] relative w-full">
    <div class="absolute top-[20px] left-[30px]">
      <img src="assets\icons\tring_AI_logo.svg" width="80" height="80">
    </div>
    <div
      class="flex flex-col items-center justify-center p-5 field_shadow bg-[#FFFFFF] w-[60%] h-[60%]">
      <div class="flex items-center justify-center w-[80px] h-[80px] bg-[#424BD1] rounded-full">
        <PaymentSuccessIcon />
      </div>
      <div class="font-bold text-[#424BD1] text-[25px] pt-4">
        Thank You!
      </div>
      <div class="font-medium text-[16px]">
        Your payment is Successful
      </div>
      <p class="text-center text-[#8A8A8A] text-[14px] py-6 w-[40%]">
        You will be redirected to the Dashboard automatically...
      </p>
      <!-- Button removed -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

definePageMeta({
  layout: "billing-account",
  middleware: "user",
});

const route = useRoute();
const router = useRouter();
const hostedPageId = route.query?.hostedpage_id;
const userId = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  console.log(hostedPageId, 'hostedPageId');
  try {
    const response = await $fetch(`/api/v2/onboarding/hostedPage?hostedpageId=${hostedPageId}`);
    userId.value = response?.org;
    
    // Add a small delay to allow the success message to be shown briefly
    setTimeout(() => {
      if (userId.value) {
        navigateTo("/");
      }
    }, 2000); // 2 second delay before redirect
    
  } catch (error) {
    console.error("Error fetching hosted page details:", error);
    isLoading.value = false;
  }
});
</script>