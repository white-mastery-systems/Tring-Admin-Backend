<script setup lang="ts">
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

  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
</script>
<template>
  <div class="sign-in-align">
    <div class="top-content-align font-bold">
      <span> Let’s Get Started </span>
    </div>
    <div class="form-align">
      <!-- <div> -->
      <UiForm
        :validation-schema="formSchema"
        :keep-values="true"
        :validate-on-mount="false"
        class="space-y-2"
        @submit="authHandlers.login"
      >
        <div class="individual-form-align">
          <UiFormField v-slot="{ componentField }" name="email">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold">E-mail</UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" class="font-medium" placeholder="Enter Your Email" type="Email" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <div class="individual-form-align">
          <UiFormField v-slot="{ componentField }" name="password">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold">Password</UiFormLabel>
              <UiFormControl>
<<<<<<< HEAD
                <UiInput
                  v-bind="componentField"
                  :type="passwordVisible ? 'text' : 'password'"
                />
                <div
                  @click="togglePasswordVisibility"
                  type="button"
                  class="eye-icon-align absolute"
                >
=======
                <UiInput v-bind="componentField" class="font-medium" placeholder="Enter Your Password"
                  :type="passwordVisible ? 'text' : 'password'" />
                <div @click="togglePasswordVisibility" type="button" class="absolute eye-icon-align">
>>>>>>> 5318049fe90f106b616f436a51c5177af429318e
                  <OpenEye v-if="passwordVisible" />
                  <CloseEyeIcon v-else />
                </div>
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <div class="forget-pws-align align_border">
            <NuxtLink to="/auth/ForgotPassword" class="align_border">
              Forgot Password?
            </NuxtLink>
          </div>
        </div>
        <!-- <div class="submit-btn-align">
          <button class="font-bold" type="submit" @click="authHandlers.login(loginData)">
            Sign in
          </button>
        </div> -->
        <UiButton type="submit" class="submit-btn-align">Sign in</UiButton>
      </UiForm>
      <!-- <div class="content-align">
        <span class="border-align"></span> <span>Or login with</span>
        <span class="border-align"></span>
      </div> -->
      <div class="mt-4 flex items-center justify-center gap-1 font-medium">
        <span>Don’t have an account?</span>
        <NuxtLink to="/auth/sign-up" class="align_border">Sign Up</NuxtLink>
      </div>
      <!-- </div> -->
    </div>
    <div class="footer-align flex items-center gap-1">
      <span class="bottom-content-align">
        By Signing up, I Agree to Tring AI
      </span>
      <a
        target="_blank"
        href="https://tringlabs.ai/terms-and-conditions"
        class="term-align"
      >
        Terms & Conditions
      </a>
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
    background-color: rgba(246, 246, 246, 1) !important;
    width: 100%;
    height: 50px;
    outline: none;
    border-radius: 10px;
    padding: 0 20px;
  }

  .submit-btn-align {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .submit-btn-align {
    background: #424bd1;
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

  .forget-pws-align {
    font-size: 13px;
    margin-top: 10px;
  }

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

<<<<<<< HEAD
  .footer-align {
    position: absolute;
    bottom: 30px;
  }
  .eye-icon-align {
    top: 35px;
    right: 10px;
  }
=======
.footer-align {
  position: absolute;
  bottom: 30px;
}
.eye-icon-align {
  top: 38px;
  right: 10px;
}
>>>>>>> 5318049fe90f106b616f436a51c5177af429318e
</style>
