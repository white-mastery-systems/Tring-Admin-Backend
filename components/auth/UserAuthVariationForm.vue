<script setup lang="ts">
import { formSchemaVariation } from '~/validationSchema/authValidation/signUpValidation';
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
  validationSchema: formSchemaVariation,
  initialValues: {
    name: "",  // Added name field
    email: "",
    password: "",
  },
});

// Define individual fields for better reactivity
const [name, nameAttrs] = defineField("name"); // Added name field
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (value) => {
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
          <Label class="sr-only" for="name">Name</Label>
          <UiInput id="name" v-model="name" v-bind="nameAttrs" placeholder="Name" type="text" auto-capitalize="words"
            auto-complete="name" auto-correct="off" :disabled="isLoading" />
          <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
        </div>

        <div class="grid gap-1">
          <Label class="sr-only" for="email">Email</Label>
          <UiInput id="email" v-model="email" v-bind="emailAttrs" placeholder="name@example.com" type="email"
            auto-capitalize="none" auto-complete="email" auto-correct="off" :disabled="isLoading" />
          <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
        </div>

        <div class="grid gap-1">
          <Label class="sr-only" for="password">Password</Label>
          <UiInput id="password" v-model="password" v-bind="passwordAttrs" placeholder="Enter your password"
            type="password" auto-complete="new-password" :disabled="isLoading" />
          <p v-if="errors.password" class="text-red-500 text-sm">
            {{ errors.password }}
          </p>
        </div>

        <UiButton :disabled="isLoading" :loading="isLoading">
          <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Sign In with Email
        </UiButton>
      </div>
    </form>
  </div>
</template>
