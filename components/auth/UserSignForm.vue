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

// Define individual fields for better reactivity
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
// const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");


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
        <!-- <div class="grid gap-1">
          <Label class="sr-only" for="email">Email</Label>
          <UiInput class="text-[14px]" id="email" v-model="email" v-bind="emailAttrs" placeholder="Enter Your Email"
            type="email" auto-capitalize="none" auto-complete="email" auto-correct="off" :disabled="isLoading" />
          <p v-if="errors.email" class="text-[#ef4444] text-[11px]">{{ errors.email }}</p>
        </div> -->
        <TextField type="password" name="password" placeholder="Password" />
        <!-- 
        <div class="grid gap-1">
          <Label class="sr-only" for="password">Password</Label>
          <UiInput id="password" v-model="password" v-bind="passwordAttrs" placeholder="Enter your password"
            type="password" auto-complete="new-password" :disabled="isLoading" autocomplete="off"
            class="focus:bg-transparent focus:ring-0 focus:outline-none text-[14px]" />
          <p v-if="errors.password" class="text-[#ef4444] text-[11px]">
            {{ errors.password }}
          </p>
        </div> -->
        <div class="text-right text-sm text-[#000000] cursor-pointer">
          <NuxtLink to="/auth/forgot-password" class="text-[11px] underline">
            Forgot Password?
          </NuxtLink>
          <!-- Forgot Password? -->
        </div>
        <!-- <div class="grid gap-1">
          <Label class="sr-only" for="confirmPassword">Confirm Password</Label>
          <UiInput id="confirmPassword" v-model="confirmPassword" v-bind="confirmPasswordAttrs"
            placeholder="Confirm your password" type="password" auto-complete="new-password" :disabled="isLoading" />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm">
            {{ errors.confirmPassword }}
          </p>
        </div> -->

        <UiButton :disabled="isLoading" :loading="isLoading" class="text-[16px] mt-5">
          <!-- <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" /> -->
          Login In
        </UiButton>
      </div>
    </form>

    <!-- <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div> -->
    <!-- <UiButton variant="outline" type="button" :disabled="isLoading">
      <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      <GitHubLogo v-else class="mr-2 h-4 w-4" />
      GitHub
    </UiButton> -->
  </div>
</template>