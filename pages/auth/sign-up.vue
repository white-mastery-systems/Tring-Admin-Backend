<script setup lang="ts">
  definePageMeta({
    layout: "auth",
    middleware: "guest-only",
  });
  // const formSchema = toTypedSchema(
  //     z
  //       .object({
  //         username: z.string().min(2, "Invalid email address."),
  //         password: z
  //           .string(),

  //         confirmPassword: z.string().min(2, "Role must be provided."),
  //       })
  //   )
  const formSchema = toTypedSchema(
    z
      .object({
        email: z
          .string()
          .email("Invalid email address.")
          .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, "Email must be in lowercase."),
        // username: z.string().email("Invalid email address."),
        password: z
          .string()
          .min(6, "Password must be at least 6 characters long."),
        confirmPassword: z
          .string()
          .min(6, "Confirm Password must be at least 6 characters long."),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"], // Point to the field that has the issue
      }),
  );
  const animationProps = {
    duration: 500,
  };
  const passwordVisible = ref(false);
  const confirmPasswordVisible = ref(false);

  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
  const toggleConfirmPasswordVisibility = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  };
  // const togglePasswordVisibility = () => {
  //   passwordVisible.value = !passwordVisible.value;
  // };
  // const toggleConfirmPasswordVisibility = () => {
  //   confirmPasswordVisible.value = !confirmPasswordVisible.value;
  // };

  const onSubmit = (values: any) => {
    // if (
    //   loginData.username.length < 1 ||
    //   loginData.password.length < 1 ||
    //   loginData.password !== loginData.confirmPassword
    // ) {
    //   toast.error("Please enter valid details");
    // }
    authHandlers.signup({
      email: values.email,
      password: values.password,
    });
  };
</script>
<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="w-[90%] px-0 pb-[20px] font-bold text-[#424bd1] md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]">
      <span> Let’s Get Started </span>
    </div>
    <div class="flex w-[90%] flex-col px-0 md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]">
      <!-- <div> -->
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" class="mb-6 space-y-5"
        @submit="onSubmit">
        <!-- <div class="individual-form-align"> -->
        <UiFormField v-slot="{ componentField }" name="email">
          <UiFormItem class="w-full">
            <UiFormLabel class="font-bold">E-mail</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" placeholder="Enter Your Email"
                class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium" type="Email" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <!-- <label for="fmail" class="mb-4 font-[10px] font-bold">E-mail</label>
        <input class="mb-2 mt-2" type="text" id="frole" name="fmail" v-model="loginData.username" /> -->
        <!-- </div> -->
        <!-- <div class="individual-form-align"> -->
        <!-- <label for="fpassword" class="font-bold">Password</label> -->
        <UiFormField v-slot="{ componentField }" name="password">
          <UiFormItem class="relative w-full">
            <UiFormLabel class="font-bold">Password</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" placeholder="Enter Your Password"
                :type="passwordVisible ? 'text' : 'password'" class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium" />
              <div @click="togglePasswordVisibility" type="button" class="absolute right-[10px] top-[38px]">
                <OpenEye v-if="passwordVisible" />
                <CloseEyeIcon v-else />
              </div>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <!-- <div class="forget-pws-align align_border">Forgot Password?</div> -->
        <!-- </div> -->
        <!-- <div class="individual-form-align"> -->
        <!-- <label for="confirmPassword" class="font-bold">Confirm Password</label> -->
        <UiFormField v-slot="{ componentField }" name="confirmPassword" class="mb-6">
          <UiFormItem class="relative w-full">
            <UiFormLabel class="font-bold">Confirm Password</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" placeholder="Confirm Your Password"
                :type="confirmPasswordVisible ? 'text' : 'password'"
                class="h-[50px] rounded-lg bg-[#F6F6F6] font-medium outline-none" />
              <div variant="outline" size="icon" @click="toggleConfirmPasswordVisibility" type="button"
                class="absolute right-[10px] top-[38px] cursor-pointer">
                <OpenEye v-if="confirmPasswordVisible" />
                <CloseEyeIcon v-else />
              </div>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <!-- <div class="forget-pws-align align_border">Forgot Password?</div> -->
        <!-- <div class="submit-btn-align">
          <button class="font-bold" type="submit" @click="onSubmit">
            Sign up
          </button>
        </div> -->
        <UiButton type="submit" class="mt-[20px] w-full bg-[#424bd1] text-[#ffffff] hover:bg-[#424bd1]">Sign up
        </UiButton>
      </UiForm>
      <!-- <div class="content-align">
        <span class="border-align"></span> <span>Or login with</span>
        <span class="border-align"></span>
      </div> -->
      <div class="mt-4 flex items-center justify-center gap-1 font-medium">
        <span>Already have an account?</span>
        <NuxtLink to="/auth/sign-in" class="cursor-pointer text-[#424bd1] underline underline-offset-2">Sign in
        </NuxtLink>
      </div>
      <!-- </div> -->
    </div>
    <div class="absolute bottom-[30px] flex items-center gap-1">
      <span class="text-[12px] text-[#8a8a8a]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-and-conditions" class="term-align text-[12px] underline">
        Terms & Conditions
      </a>
    </div>
  </div>
</template>
