<script setup lang="ts">
import { formSchema } from '~/validationSchema/authValidation/signInValidation'
import { useGtag } from 'vue-gtag-next'

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const { event } = useGtag()
useHead({
  title: 'Sign In | Conversational AI for Businesses | Tring AI',
  meta: [
    { name: 'Description', content: 'Access your Tring AI account to explore AI Powered Solutions. Sign in now to continue your journey and enhance your business efficiency!' }
  ]
})
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
    email: "",
    password: "",
    // confirmPassword: "",
  },
});

const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true
  event('button_click', { event_category: 'engagement', event_label: 'sign_in' })
  await authHandlers.login(value)
  isLoading.value = false
})
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-0">
        <TextField type="text" name="email" placeholder="Email" />
        <TextField type="password" name="password" placeholder="Password" />
        <div class="text-right text-sm text-[#000000] cursor-pointer">
          <NuxtLink to="/auth/forgot-password" class="text-[11px] underline">
            Forgot Password?
          </NuxtLink>
          <!-- Forgot Password? -->
        </div>

        <UiButton :disabled="isLoading" :loading="isLoading" class="text-[16px] mt-5">
          <!-- <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" /> -->
          Login
        </UiButton>
      </div>
    </form>
  </div>
</template>