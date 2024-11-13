<script setup lang="ts">
  import { formSchema } from '~/validationSchema/authValidation/signUpValidation';
  import { useGtag } from 'vue-gtag-next'

  const { event } = useGtag()

  useHead({
    title: 'Sign Up | Conversational AI for Businesses | Tring AI',
    meta: [
      { name: 'Description', content: 'Sign up with Tring AI to unlock innovative AI-powered solutions for enhancing your business efficiency and growth. Tring AI provides conversational AI chatbot and voice bot solutions for businesses to drive sales, optimize marketing, enhance customer support and boost lead generation. Join the league of AI-powered businesses today.' }
    ]
  })


  definePageMeta({
    layout: "auth",
    middleware: "guest-only",
  });

  const isLoading = ref(false)
  // const formSchema = toTypedSchema(
  //     z
  //       .object({
  //         username: z.string().min(2, "Invalid email address."),
  //         password: z
  //           .string(),

  //         confirmPassword: z.string().min(2, "Role must be provided."),
  //       })
  //   )


  const {
    setFieldValue,
    handleSubmit,
    errors,
    values,
    defineField,
    resetForm,
  } = useForm({
    validationSchema: formSchema,
    initialValues: {
      // name: "",
    },
  });
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

  const onSubmit = handleSubmit( async(value: any) => {
    isLoading.value = true
    event('button_click', { event_category: 'engagement', event_label: 'sign_up' })
    await authHandlers.signup(value);
    isLoading.value = false
  });
</script>
<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="w-[90%] px-0 pb-[20px] font-bold text-[#424bd1] md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]">
      <span> Let’s Get Started </span>
    </div>
    <div class="flex w-[90%] flex-col px-0 md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]">
      <!-- <div> -->
      <form class="space-y-2" @submit="onSubmit">
        <!-- copy paste the class  below-->
        <!-- class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium" -->

        <div class="grid  gap-4">
          <TextField type="email" name="email" label="E-mail" placeholder="Enter Your Email" required />
          <div class="relative">
            <TextField :type="passwordVisible ? 'text' : 'password'" name="password" label="Password"
              placeholder="Password" required>
              <template #endIcon>
                <div class="w-[30px] cursor-pointer absolute right-0 top-[5px]" @click="togglePasswordVisibility"
                  type="button">
                  <OpenEye v-if="passwordVisible" />
                  <CloseEyeIcon v-else />
                </div>
              </template>
            </TextField>
          </div>
          <div class="relative">
            <TextField :type="confirmPasswordVisible ? 'text' : 'password'" name="confirmPassword"
              label="Confirm Password" placeholder="Confirm Your Password" required>
              <template #endIcon>
                <div class="w-[30px] cursor-pointer absolute right-0 top-[5px]"
                  @click="toggleConfirmPasswordVisibility" type="button">
                  <OpenEye v-if="confirmPasswordVisible" />
                  <CloseEyeIcon v-else />
                </div>
              </template>
            </TextField>
          </div>

          <UiButton type="submit" class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
            :loading="isLoading">Sign Up
          </UiButton>
        </div>
      </form>
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