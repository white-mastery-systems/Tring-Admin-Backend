<template>
  <div class="flex flex-col items-center justify-center h-full w-full">
    <!-- <div class="font-bold text-[#424bd1] xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0 pb-[5px]">
      <span>
        OTP Verification
      </span>
    </div> -->
    <div class="flex flex-col xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0">
      <!-- <div> -->

      <form @submit.prevent="onSubmit" class="space-y-5">
        <TextField type="text" name="otp" label="OTP Verification" placeholder="Enter your OTP"
          required disableCharacters helperText="OTP has been sent to your mail ID" />
          <!-- <div class=" text-[#FFBC42] text-[14px] underline self-end cursor-pointer mt-3"
            :class="{ 'cursor-not-allowed': isResendDisabled }" @click="resendOTP" :disabled="isResendDisabled">
            <span v-if="!isResendDisabled">Resend OTP</span>
            <span v-else>Resend available in {{ countdownTime }}</span>
          </div> -->
        <UiButton type="submit" class="flex justify-center w-full bg-[#424bd1] h-[45px] hover:bg-[#424bd1]">
          Continue
        </UiButton>
      </form>
      <!-- <div class="submit-btn-align">
        <button class="font-bold" type="submit" @click="authHandlers.login(loginData)">
          Continue
        </button>
      </div> -->
      <!-- </div> -->
    </div>
    <div class="flex items-center gap-1 absolute bottom-[30px]">
      <span class="text-[#8A8A8A] text-[12px]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-conditions" class="underline text-[12px]"> Terms &
        Conditions </a>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});
const isResendDisabled = ref(false)
const userDetails = ref()
const countdownTime = ref(0)

onMounted(() => {
  const storedDetails = localStorage.getItem('userDetails');
  // userDetails.value = null
  if (storedDetails) {
    try {
      userDetails.value = JSON.parse(storedDetails); // Parse string into object
    } catch (error) {
      console.error("Error parsing storedDetails", error);
    }
  }
});

const otpVerifySchema = toTypedSchema(
  z.object({
    otp: z.string({ required_error: "OTP must be at least 4 characters long." }).length(4, "OTP must be exactly 4 characters long."),
  }));
const {
  setFieldValue,
  handleSubmit,
  errors,
  values,
  defineField,
  resetForm,
} = useForm({
  validationSchema: otpVerifySchema,
});

const onSubmit = handleSubmit((value: any) => {
  // const storedDetails = localStorage.getItem('userDetails');
  // const userDetails = storedDetails ? JSON.parse(storedDetails) : null; // Parse the details once

  // Check if otp or userDetails is missing
  if (!value.otp || !userDetails.value?.id) {
    toast.error("OTP or user details missing");
    return;
  }

  const ottPayload = {
    userId: userDetails.value?.id,
    otp: value.otp
  };


  // Call OTP verification handler
  authHandlers.OtpVerification(ottPayload);
});
</script>