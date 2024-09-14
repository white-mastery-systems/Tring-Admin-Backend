<script setup lang="ts">
  definePageMeta({
    layout: "auth",
    middleware: "guest-only",
  });
  // definePageMeta({
  //   layout: "auth",
  //   middleware: "guest-only",
  // });

  // const loginData = reactive({
  //   email: "",
  //   password: "",
  // });
  // const formSchema = toTypedSchema(
  //   z.object({
  //     email: z.string().email("Invalid email address."),
  //     password: z
  //       .string()
  //       .min(6, "Password must be at least 6 characters long."),
  //   }),
  // );
  // const passwordVisible = ref(false);
  // const animationProps = {
  //   duration: 500,
  // };
  const formSchema = toTypedSchema(
    z.object({
      email: z
        .string()
        .email("Invalid email address.")
        .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, "Email must be in lowercase."),
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
  // const togglePasswordVisibility = () => {
  //   passwordVisible.value = !passwordVisible.value;
  // };
</script>
<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div
      class="w-[90%] px-0 pb-[20px] font-bold text-[#424bd1] lg:w-[80%] lg:px-6"
    >
      <span> Let’s Get Started </span>
    </div>
    <div class="flex w-[90%] flex-col px-0 lg:w-[80%] lg:px-6">
      <!-- <div> -->
      <UiForm
        :validation-schema="formSchema"
        :keep-values="true"
        :validate-on-mount="false"
        class="mb-4 space-y-6"
        @submit="authHandlers.login"
      >
        <UiFormField v-slot="{ componentField }" name="email">
          <UiFormItem class="w-full">
            <UiFormLabel class="font-bold">E-mail</UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium"
                placeholder="Enter Your Email"
                type="Email"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <div class="relative mb-5">
          <UiFormField v-slot="{ componentField }" name="password">
            <UiFormItem class="relative w-full">
              <UiFormLabel class="font-bold">Password</UiFormLabel>
              <UiFormControl>
                <UiInput
                  v-bind="componentField"
                  class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium"
                  placeholder="Enter Your Password"
                  :type="passwordVisible ? 'text' : 'password'"
                />
                <div
                  @click="togglePasswordVisibility"
                  type="button"
                  class="absolute right-[10px] top-[38px] cursor-pointer"
                >
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
        <UiButton
          type="submit"
          class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
          >Sign in
        </UiButton>
      </UiForm>
      <!-- <div class="content-align">
        <span class="border-align"></span> <span>Or login with</span>
        <span class="border-align"></span>
      </div> -->
      <div class="mt-7 flex items-center justify-center gap-1 font-medium">
        <span>Don’t have an account?</span>
        <NuxtLink
          to="/auth/sign-up"
          class="cursor-pointer text-[#424bd1] underline underline-offset-2"
        >
          Sign Up
        </NuxtLink>
      </div>
      <!-- </div> -->
    </div>
    <div class="absolute bottom-[30px] flex items-center gap-1">
      <span class="text-[12px] text-[#8a8a8a]">
        By Signing up, I Agree to Tring AI
      </span>
      <a
        target="_blank"
        href="https://tringlabs.ai/terms-and-conditions"
        class="text-[12px] underline"
      >
        Terms & Conditions
      </a>
    </div>
  </div>
</template>
