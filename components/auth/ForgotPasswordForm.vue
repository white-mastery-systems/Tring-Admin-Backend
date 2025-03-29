<script setup lang="ts">
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { Eye, EyeOff } from 'lucide-vue-next'; // Import Lucide icons

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const route = useRoute();
const isLoading = ref(false);
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const forgotPasswordSchema = toTypedSchema(z.object({
  email: z.string({ required_error: "Email is required." }).email("Invalid email address."),
}));

const resetPasswordSchema = toTypedSchema(z.object({
  newPassword: z.string({ required_error: "Password is required." }).min(6, "Password must be at least 6 characters long."),
  confirmPassword: z.string({ required_error: "Confirm Password is required." }).min(6, "Confirm Password must be at least 6 characters long."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
}));

const schema = ref(route.query.token ? resetPasswordSchema : forgotPasswordSchema);

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema.value,
});

const [email, emailAttrs] = defineField("email");
const [newPassword, newPasswordAttrs] = defineField("newPassword");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

// Toggle password visibility functions
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value;
};

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  if (route.query.token) {
    await authHandlers.resetPassword(values, route.query.token);
  } else {
    await authHandlers.forgotPassword(values);
  }
  isLoading.value = false;
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div v-if="!route.query.token" class="grid gap-3">
          <TextField type="text" name="email" placeholder="Enter your email" />
        </div>
        <div v-else class="grid gap-3">
          <!-- New Password field with eye icon -->
          <div class="relative">
            <TextField :type="passwordVisible ? 'text' : 'password'" name="newPassword" placeholder="New Password" />
            <div
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 cursor-pointer"
              @click="togglePasswordVisibility" role="button" tabindex="0" aria-label="Toggle password visibility">
              <EyeOff v-if="passwordVisible" size="20" class="mt-1" />
              <Eye v-else size="20" class="mt-1" />
            </div>
          </div>

          <!-- Confirm Password field with eye icon -->
          <div class="relative">
            <TextField :type="confirmPasswordVisible ? 'text' : 'password'" name="confirmPassword"
              placeholder="Confirm Password" />
            <div
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 cursor-pointer"
              @click="toggleConfirmPasswordVisibility" role="button" tabindex="0"
              aria-label="Toggle confirm password visibility">
              <EyeOff v-if="confirmPasswordVisible" size="20" class="mt-1" />
              <Eye v-else size="20" class="mt-1" />
            </div>
          </div>
        </div>
        <UiButton type="submit"
          class="text-[16px] mt-5 bg-[#FFBC42] button_shadow transition-all duration-300 hover:bg-[#ffce6b] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:bg-[#f0b03c] active:shadow-md"
          :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </div>
</template>