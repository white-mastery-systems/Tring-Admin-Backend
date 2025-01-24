<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="w-full px-0 pb-[20px] text-[20px] font-bold text-[#424bd1] lg:w-[80%] lg:px-6">
      <span> Log in to your account </span>
    </div>
    <div class="flex w-full flex-col px-0 lg:w-[80%] lg:px-6">

      <form class="space-y-2" @submit="onSubmit">
        <div class="flex flex-col gap-2">
          <TextField type="email" name="email" label="E-mail" placeholder="Enter Your Email" required />
          <div class="relative">
            <TextField :type="passwordVisible ? 'text' : 'password'" name="password" label="Password"
              placeholder="Password" required>
              <template #endIcon>
                <div class="w-[30px] cursor-pointer mt-2" @click="togglePasswordVisibility" type="button">
                  <OpenEye v-if="passwordVisible" />
                  <CloseEyeIcon v-else />
                </div>
              </template>
            </TextField>

          </div>
          <div class="mt-2 mb-4 flex  justify-end gap-1 font-medium">
            <!-- underline underline-offset-2 -->
            <NuxtLink to="/auth/forgot-password" class="cursor-pointer text-[#424bd1] font-normal">
              Forgot Password?
            </NuxtLink>
          </div>

          <UiButton type="submit" class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
            :loading="isLoading"> Continue
          </UiButton>
        </div>
      </form>

      <div class="mt-4 flex items-center justify-center gap-1 font-normal">
        <span>Don’t have an account?</span>
        <NuxtLink to="/auth/sign-up" class="cursor-pointer text-[#424bd1] underline underline-offset-2 font-medium">
          Sign up
        </NuxtLink>
      </div>
      <!-- </div> -->
    </div>
    <div class="absolute bottom-[30px] flex items-center gap-1">
      <span class="text-[12px] text-[#8a8a8a]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-conditions" class="text-[12px] underline">
        Terms & Conditions
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGtag } from 'vue-gtag-next';
import { formSchema } from '~/validationSchema/authValidation/signInValidation';

const { event } = useGtag()

useHead({
  title: 'Sign In | Conversational AI for Businesses | Tring AI',
  meta: [
    { name: 'Description', content: 'Access your Tring AI account to explore AI Powered Solutions. Sign in now to continue your journey and enhance your business efficiency!' }
  ]
})


definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});


const passwordVisible = ref(false);
const animationProps = {
  duration: 500,
};
const isLoading = ref(false)

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

const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true
  event('button_click', { event_category: 'engagement', event_label: 'sign_in' })
  await authHandlers.login(value)
  isLoading.value = false
})
</script>