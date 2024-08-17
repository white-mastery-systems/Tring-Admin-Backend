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
      username: z
        .string()
        .email("Invalid email address."),
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
    email: values.username,
    password: values.password,
  });
};
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="font-bold text-[#424bd1] w-[80%] px-6 pb-[20px]">
      <span> Let’s Get Started </span>
    </div>
    <div class="flex flex-col w-[80%] px-6">
      <!-- <div> -->
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" class="space-y-5 mb-6"
        @submit="onSubmit">
        <!-- <div class="individual-form-align"> -->
        <UiFormField v-slot="{ componentField }" name="username">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold">E-mail</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" placeholder="Enter Your Email"
                class="font-medium h-[50px] rounded-lg bg-[#f6f6f6]" type="Email" />
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
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold">Password</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" placeholder="Enter Your Password"
                :type="passwordVisible ? 'text' : 'password'" class="font-medium h-[50px] rounded-lg bg-[#f6f6f6]" />
              <div @click="togglePasswordVisibility" type="button" class="absolute absolute top-[38px] right-[10px]">
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
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold">Confirm Password</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" placeholder="Confirm Your Password"
                :type="confirmPasswordVisible ? 'text' : 'password'" class="outline-none font-medium h-[50px] rounded-lg bg-[#F6F6F6]" />
              <div variant="outline" size="icon" @click="toggleConfirmPasswordVisibility" type="button"
                class="absolute top-[38px] right-[10px]">
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
        <UiButton type="submit" class="bg-[#424bd1] text-[#ffffff] hover:bg-[#424bd1] mt-[20px] w-full">Sign up
        </UiButton>
      </UiForm>
      <!-- <div class="content-align">
        <span class="border-align"></span> <span>Or login with</span>
        <span class="border-align"></span>
      </div> -->
      <div class="mt-4 flex items-center justify-center gap-1 font-medium">
        <span>Already have an account?</span>
        <NuxtLink to="/auth/sign-in" class="text-[#424bd1] cursor-pointer underline underline-offset-2">Sign in
        </NuxtLink>
      </div>
      <!-- </div> -->
    </div>
    <div class="absolute flex items-center gap-1 bottom-[30px]">
      <span class="text-[#8a8a8a] text-[12px]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-and-conditions" class="term-align text-[12px] underline">
        Terms & Conditions
      </a>
    </div>
  </div>
</template>
