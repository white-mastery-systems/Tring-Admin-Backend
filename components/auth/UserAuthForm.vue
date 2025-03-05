<script setup lang="ts">
import { formSchema } from '~/validationSchema/authValidation/signUpValidation';
import { useGtag } from 'vue-gtag-next';

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const { event } = useGtag();
useHead({
  title: 'Sign Up | Conversational AI for Businesses | Tring AI',
  meta: [
    { name: 'Description', content: 'Sign up with Tring AI to unlock innovative AI-powered solutions for enhancing your business efficiency and growth. Tring AI provides conversational AI chatbot and voice bot solutions for businesses to drive sales, optimize marketing, enhance customer support and boost lead generation. Join the league of AI-powered businesses today.' }
  ]
});

const isLoading = ref(false);

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
    username: "",
    email: "",
    password: "",
  },
});

// Define individual fields for better reactivity

const onSubmit = handleSubmit(async (value) => {
  isLoading.value = true;
  event('button_click', { event_category: 'engagement', event_label: 'sign_up' });
  await authHandlers.signup(value);
  isLoading.value = false;
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-0">
        <TextField type="text" name="username" placeholder="Full Name" />
        <TextField type="text" name="email" placeholder="Email" />
        <!-- Password Field -->
        <TextField type="password" name="password" placeholder="Password" />
        <UiButton :disabled="isLoading" :loading="isLoading" class="text-[16px] mt-5">
          Sign up
        </UiButton>

      </div>
    </form>
  </div>
</template>
