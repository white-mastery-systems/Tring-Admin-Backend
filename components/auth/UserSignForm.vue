<script setup lang="ts">
import { formSchema } from '~/validationSchema/authValidation/signInValidation'
import { useGtag } from 'vue-gtag-next'
import { Eye, EyeOff } from 'lucide-vue-next' // Import Lucide icons

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
const showPassword = ref(false) // Add this for password visibility toggle

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

// Add toggle password visibility function
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

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

        <!-- Password field with eye icon -->
        <div class="relative">
          <TextField :type="showPassword ? 'text' : 'password'" name="password" placeholder="Password" />
          <div
            class="absolute inset-y-0 right-0 flex top-2 items-center px-3 text-gray-500 hover:text-gray-700 cursor-pointer h-[40px]"
            @click="togglePasswordVisibility" role="button" tabindex="0" aria-label="Toggle password visibility">
            <EyeOff v-if="showPassword" size="20" />
            <Eye v-else size="20" />
          </div>
        </div>

        <div class="text-right text-sm text-[#000000] cursor-pointer">
          <NuxtLink to="/auth/forgot-password" class="text-[11px] underline text-[#424BD1]">
            Forgot Password?
          </NuxtLink>
        </div>
        <UiButton :disabled="isLoading" :loading="isLoading"
          class="text-[16px] mt-5 bg-[#FFBC42] button_shadow transition-all duration-300 hover:bg-[#ffce6b] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:bg-[#f0b03c] active:shadow-md">
          Login
        </UiButton>
      </div>
    </form>
  </div>
</template>