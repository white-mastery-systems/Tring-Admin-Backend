<script setup lang="ts">
import { formSchema } from '~/validationSchema/authValidation/signUpValidation';
import { useGtag } from 'vue-gtag-next';
import { Eye, EyeOff } from 'lucide-vue-next'; // Import Lucide icons

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
const showPassword = ref(false); // Add this for password visibility

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
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

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
        <TextField type="text" name="username" placeholder="Name" :disableSpecialCharacters="true" />
        <TextField type="text" name="email" placeholder="Email" />
        <!-- Password Field with Eye Icon -->
        <div class="relative">
          <TextField :type="showPassword ? 'text' : 'password'" name="password" placeholder="Password"
            :textFieldMaxLength="30" />
          <div
            class="absolute inset-y-0 right-0 top-2 flex items-center px-3 text-gray-500 hover:text-gray-700 cursor-pointer h-[40px]"
            @click="togglePasswordVisibility" role="button" tabindex="0" aria-label="Toggle password visibility">
            <EyeOff v-if="showPassword" size="20" />
            <Eye v-else size="20" />
          </div>
        </div>
        <UiButton color="primary" :disabled="isLoading" :loading="isLoading"
          class="text-[16px] mt-5 button_shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md">
          Sign up
        </UiButton>
      </div>
    </form>
  </div>
</template>