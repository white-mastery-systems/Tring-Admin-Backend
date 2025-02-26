<script setup lang="ts">
import { formSchema } from '~/validationSchema/authValidation/signUpValidation';
import { useGtag } from 'vue-gtag-next'

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const { event } = useGtag()
useHead({
  title: 'Sign Up | Conversational AI for Businesses | Tring AI',
  meta: [
    { name: 'Description', content: 'Sign up with Tring AI to unlock innovative AI-powered solutions for enhancing your business efficiency and growth. Tring AI provides conversational AI chatbot and voice bot solutions for businesses to drive sales, optimize marketing, enhance customer support and boost lead generation. Join the league of AI-powered businesses today.' }
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


const onSubmit = handleSubmit( async(value) => {
  isLoading.value = true
  event('button_click', { event_category: 'engagement', event_label: 'sign_up' })
  await authHandlers.signup(value);
  isLoading.value = false
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <div class="grid gap-1">
          <Label class="sr-only" for="email">Email</Label>
          <UiInput id="email" v-model="email" v-bind="emailAttrs" placeholder="Enter Your Email" type="email"
            auto-capitalize="none" auto-complete="email" auto-correct="off" :disabled="isLoading" />
          <p v-if="errors.email" class="text-[#ef4444] text-[13px]">{{ errors.email }}</p>
        </div>

        <div class="grid gap-1">
          <Label class="sr-only" for="password">Password</Label>
          <UiInput id="password" v-model="password" v-bind="passwordAttrs" placeholder="Enter your password"
            type="password" auto-complete="new-password" :disabled="isLoading" />
          <p v-if="errors.password" class="text-[#ef4444] text-[13px]">
            {{ errors.password }}
          </p>
        </div>

        <!-- <div class="grid gap-1">
          <Label class="sr-only" for="confirmPassword">Confirm Password</Label>
          <UiInput id="confirmPassword" v-model="confirmPassword" v-bind="confirmPasswordAttrs"
            placeholder="Confirm your password" type="password" auto-complete="new-password" :disabled="isLoading" />
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm">
            {{ errors.confirmPassword }}
          </p>
        </div> -->

        <UiButton :disabled="isLoading" :loading="isLoading">
          <!-- <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" /> -->
          Sign up with Email
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
