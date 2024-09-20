<script setup lang="ts">
  import { formSchema } from '~/validationSchema/authValidation/signInValidation';
  import { useGtag } from 'vue-gtag-next'

  const { event } = useGtag()

  useHead({
    title: 'Sign In | Conversational AI for Businesses | Tring AI',
    meta: [
      {name: 'Description', content: 'Access your Tring AI account to explore AI Powered Solutions. Sign in now to continue your journey and enhance your business efficiency!'}
    ]
  })


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

  const passwordVisible = ref(false);
  const animationProps = {
    duration: 500,
  };

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
  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
  // const togglePasswordVisibility = () => {
  //   passwordVisible.value = !passwordVisible.value;
  // };
  const onSubmit =  handleSubmit((value:any)=>{
    event('button_click', { event_category: 'engagement', event_label: 'sign_in' })
    authHandlers.login(value)
  })
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

      <form class="space-y-2" @submit="onSubmit">
        <div class="flex flex-col gap-2">
          <TextField
            type="email"
            name="email"
            label="E-mail"
            placeholder="Enter Your Email"
            required
          />
          <div class="relative">
          <TextField
            :type="passwordVisible? 'text' : 'password'"
            name="password"
            label="Password"
            placeholder="Password"
            required
          >
          <template #endIcon>
             <div class="w-[30px] cursor-pointer"
            @click="togglePasswordVisibility"
            type="button"
          >
            <OpenEye v-if="passwordVisible" />
            <CloseEyeIcon v-else />
          </div>
            </template>
          </TextField>
         
          </div>
               

          <UiButton
          type="submit"
          class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
          >Sign in
        </UiButton>
        </div>
      </form>

      <!-- <div class="content-align">
        <span class="border-align"></span> <span>Or login with</span>
        <span class="border-align"></span>
      </div> -->
            <div class="mt-4 flex  justify-end gap-1 font-medium">
        <NuxtLink
          to="/auth/forgot-password"
          class="cursor-pointer text-[#424bd1] underline underline-offset-2"
        >
          Forgot Password
        </NuxtLink>
      </div>
      <div class="mt-4 flex items-center justify-center gap-1 font-medium">
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