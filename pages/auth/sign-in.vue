<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});
definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const loginData = reactive({
  email: "",
  password: "",
});
const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
  }),
);
const passwordVisible = ref(false);
const animationProps = {
  duration: 500,
};
const loginData = reactive({
  email: "",
  password: "",
});
const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
  }),
);
const passwordVisible = ref(false);
const animationProps = {
  duration: 500,
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="font-bold text-[#424bd1] w-[80%] px-6 pb-[20px]">
      <span> Let’s Get Started </span>
    </div>
    <div class="flex flex-col w-[80%] px-6">
      <!-- <div> -->
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" class="space-y-6 mb-4"
        @submit="authHandlers.login">
        <div>
          <UiFormField v-slot="{ componentField }" name="email">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold">E-mail</UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" class="font-medium h-[50px] border-0" placeholder="Enter Your Email"
                  type="Email" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <div class="mb-5">
          <UiFormField v-slot="{ componentField }" name="password">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold">Password</UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" class="font-medium h-[50px] border-0" placeholder="Enter Your Password"
                  :type="passwordVisible ? 'text' : 'password'" />
                <div @click="togglePasswordVisibility" type="button" class="absolute top-[38px] right-[10px] pointer">
                  <OpenEye v-if="passwordVisible" />
                  <CloseEyeIcon v-else />
                </div>
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <!-- <div class="forget-pws-align align_border">
            <NuxtLink to="/auth/ForgotPassword" class="align_border">
              Forgot Password?
            </NuxtLink>
          </div> -->
        </div>
        <!-- <div class="submit-btn-align">
          <button class="font-bold" type="submit" @click="authHandlers.login(loginData)">
            Sign in
          </button>
        </div> -->
        <UiButton type="submit" class="flex justify-center bg-[#424bd1] hover:bg-[#424bd1] w-full h-[45px]">Sign in
        </UiButton>
      </UiForm>
      <!-- <div class="content-align">
        <span class="border-align"></span> <span>Or login with</span>
        <span class="border-align"></span>
      </div> -->
      <div class="mt-7 flex items-center justify-center gap-1 font-medium">
        <span>Don’t have an account?</span>
        <NuxtLink to="/auth/sign-up" class="text-[#424bd1] cursor-pointer underline-offset-2 underline">
          Sign Up
        </NuxtLink>
      </div>
      <!-- </div> -->
    </div>
    <div class="absolute flex items-center gap-1 bottom-[30px]">
      <span class="text-[12px] text-[#8a8a8a]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-and-conditions" class="text-[12px] underline">
        Terms & Conditions
      </a>
    </div>
  </div>
</template>