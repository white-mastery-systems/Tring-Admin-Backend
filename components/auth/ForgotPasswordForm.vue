<script setup lang="ts">
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { Eye, EyeOff } from 'lucide-vue-next'; // Import Lucide icons

definePageMeta({
  layout: "auth",
});

const route = useRoute();
const isLoading = ref(false);
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const forgotPasswordSchema = toTypedSchema(z.object({
  email: z.string({ required_error: "Email is required." }).email("Invalid email address."),
}));

const resetPasswordSchema = toTypedSchema(z.object({
  newPassword: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .refine(
      (password) => {
        // Check if password contains common patterns
        const commonPatterns = ["password", "123456", "qwerty", "admin"];
        return !commonPatterns.some(pattern =>
          password.toLowerCase().includes(pattern)
        );
      },
      {
        message: "Password contains a common pattern and may be easily guessed"
      }
    ),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required." })
    .min(6, "Confirm Password must be at least 6 characters long."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
}));

const schema = ref(route.query.token ? resetPasswordSchema : forgotPasswordSchema);

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema.value,
});

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
          <TextField type="text" name="email" label="Email" placeholder="Enter your email" />
        </div>
        <div v-else class="grid gap-3">
          <!-- New Password field with eye icon -->
          <div class="relative">
            <TextField :type="passwordVisible ? 'text' : 'password'" name="newPassword" label="New Password"
              placeholder="New Password" :textFieldMaxLength="30" :passwordMaxLength="true" />
            <div
              class="absolute inset-y-0 right-0 top-[36px] sm:top-[36px] md:top-[36px] flex items-center px-3 text-gray-500 hover:text-gray-700 cursor-pointer h-[40px]"
              @click="togglePasswordVisibility" role="button" tabindex="0" aria-label="Toggle password visibility">
              <EyeOff v-if="passwordVisible" size="20" />
              <Eye v-else size="20" />
            </div>
          </div>

          <!-- Confirm Password field with eye icon -->
          <div class="relative">
            <TextField :type="confirmPasswordVisible ? 'text' : 'password'" label="Confirm Password"
              name="confirmPassword" placeholder="Confirm Password" :textFieldMaxLength="30"
              :passwordMaxLength="true" />
            <div
              class="absolute inset-y-0 right-0 top-[36px] sm:top-[36px] md:top-[36px] flex items-center px-3 text-gray-500 hover:text-gray-700 cursor-pointer h-[40px]"
              @click="toggleConfirmPasswordVisibility" role="button" tabindex="0"
              aria-label="Toggle confirm password visibility">
              <EyeOff v-if="confirmPasswordVisible" size="20" />
              <Eye v-else size="20" />
            </div>
          </div>
        </div>
        <UiButton color="primary" type="submit"
          class="text-[16px] mt-5 bg-[#FFBC42] button_shadow transition-all duration-300 hover:bg-[#ffce6b] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:bg-[#f0b03c] active:shadow-md"
          :loading="isLoading">
          {{ (!route.query.token) ? 'Send Request' : 'Reset Password' }}
        </UiButton>
      </div>
    </form>
  </div>
</template>