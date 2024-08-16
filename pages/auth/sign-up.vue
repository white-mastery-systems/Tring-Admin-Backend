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
  z.object({
  username: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long."),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Point to the field that has the issue
}));

const loginData = reactive({
  username: "",
  password: "",
  confirmPassword: "",
});
const animationProps = {
  duration: 500,
};
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value
}

const onSubmit = (values:any) => {
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
  <div class="sign-in-align">
    <div class="top-content-align font-bold">
      <span> Let’s Get Started </span>
    </div>
    <div class="form-align">
      <!-- <div> -->
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" class="space-y-2"
        @submit="onSubmit">
        <!-- <div class="individual-form-align"> -->
        <UiFormField v-slot="{ componentField }" name="username">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold">E-mail</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="Email" />
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
              <UiInput v-bind="componentField" :type="passwordVisible ? 'text' : 'password'" />
              <div @click="togglePasswordVisibility" type="button" class="absolute eye-icon-align">
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
        <UiFormField v-slot="{ componentField }" name="confirmPassword">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold">Confirm Password</UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" :type="confirmPasswordVisible ? 'text' : 'password'" />
              <div @click="toggleConfirmPasswordVisibility" type="button" class="absolute eye-icon-align">
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
          <UiButton type="submit" class="submit-btn-align">Sign up</UiButton>
      </UiForm>
      <div class="content-align">
        <span class="border-align"></span> <span>Or login with</span>
        <span class="border-align"></span>
      </div>
      <div class="flex items-center justify-center gap-1 font-medium">
        <span>Already have an account?</span>
        <NuxtLink to="/auth/sign-in" class="align_border">Sign in</NuxtLink>
      </div>
      <!-- </div> -->
    </div>
    <div class="footer-align flex items-center gap-1">
      <span class="bottom-content-align">
        By Signing up, I Agree to Tring AI
      </span>
      <span class="term-align"> Terms & Conditions </span>
    </div>
  </div>
</template>

<style scoped>
.sign-in-align {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.top-content-align {
  color: #424bd1;
  width: 80%;
  padding: 0 25px;
  /* padding-right: 172px; */
  padding-bottom: 20px;
}

.form-align {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80%;
  padding: 0 25px;
}

form {
  width: 100%;
  display: flex;
  gap: 15px;
  /* flex-wrap: wrap; */
  flex-direction: column;
  /* align-items: start; */
}

/* .individual-form-align {
    gap: 5px;
  } */
.individual-form-align input {
  background-color: rgba(246, 246, 246, 1);
  width: 100%;
  height: 50px;
  outline: none;
  border-radius: 10px;
  padding: 0 20px;
}

/* .submit-btn-align {
  width: 100%;
  display: flex;
  justify-content: center;
} */

.submit-btn-align {
  background: #424bd1 !important;
  color: #ffffff;
  /* margin-top: 30px; */
  /* margin-right: 170px; */
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

input[type="password"] {
  padding-right: 2.5rem;
  /* Adjust based on the icon size */
  width: 100%;
}

.eye-icon {
  position: absolute;
  right: 0.5rem;
  /* Adjust based on your design */
  cursor: pointer;
  font-size: 1rem;
  /* Adjust size as needed */
}

.eye-icon i {
  display: inline-block;
}

/* .forget-pws-align {
  font-size: 13px;
  margin-top: 10px;
} */

.align_border {
  color: #424bd1;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}

.content-align {
  color: #8a8a8a;
  height: 80px;
  font-size: 12px;
  font-weight: 400;
  gap: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* align-self: center; */
}

.border-align {
  width: 30%;
  height: 10px;
  margin-top: 11px;
  border-top: 1px solid #8a8a8a;
}

.bottom-content-align {
  color: #8a8a8a;
  font-size: 12px;
}

.term-align {
  font-size: 12px;
  text-decoration: underline;
}

.footer-align {
  position: absolute;
  bottom: 30px;
}
.eye-icon-align {
  top: 35px;
  right: 10px;
}
</style>
