<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const formSchema = toTypedSchema(
  z.object({
    otp: z.string().min(4, "Invalid otp."),
  }));
const animationProps = {
  duration: 500,
}
</script>
<template>
  <div class="flex flex-col items-center justify-center h-full w-full">
    <div class="font-bold text-[#424bd1] xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0 pb-[5px]">
      <span>
        OTP Verification
      </span>
    </div>
    <div class="flex flex-col xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0">
      <!-- <div> -->
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" class="space-y-2"
        @submit="authHandlers.login">
        <div class="mb-6 mt-3">
          <UiFormField v-slot="{ componentField }" name="otp">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <!-- <UiFormLabel class="font-bold">OTP</UiFormLabel> -->
              <UiFormControl>
                <UiInput v-bind="componentField" type="text" placeholder="Enter Your OTP"
                  class="font-medium h-[50px]" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <UiButton type="submit" class="flex justify-center w-full bg-[#424bd1] h-[45px] hover:bg-[#424bd1]">
          Continue
        </UiButton>
      </UiForm>
      <div class="text-[#FFBC42] text-[14px] underline self-end cursor-pointer mt-3">
        <span>Resend OTP</span>
      </div>
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
      <a target="_blank" href="https://tringlabs.ai/terms-and-conditions" class="underline text-[12px]"> Terms &
        Conditions </a>
    </div>
  </div>
</template>