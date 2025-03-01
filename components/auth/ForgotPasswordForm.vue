<script setup lang="ts">
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';

definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});

const route = useRoute();
const isLoading = ref(false);
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);

const forgotPasswordSchema = toTypedSchema(z.object({
  email: z.string({ required_error: "Email is required."}).email("Invalid email address."),
}));

const resetPasswordSchema = toTypedSchema(z.object({
  newPassword: z.string({ required_error: "Password is required."}).min(6, "Password must be at least 6 characters long."),
  confirmPassword: z.string({ required_error: "Confirm Password is required."}).min(6, "Confirm Password must be at least 6 characters long."),
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
  <!-- class="flex h-full w-full flex-col items-center justify-center" -->
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <!-- <div class="w-[90%] px-6 pb-4 font-bold text-primary md:w-[80%] lg:w-[90%] xl:w-[80%]">
      <span>Forgot Password</span>
    </div> -->
    <!-- <div class="w-full"> -->
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div v-if="route.query.token" class="grid gap-3">
          <UiInput id="email" v-model="email" v-bind="emailAttrs" placeholder="Enter your email" type="email"
            required />
          <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
        </div>
        <div v-else class="grid gap-3">
          <div>
            <UiInput id="newPassword" v-model="newPassword" v-bind="newPasswordAttrs"
              :type="passwordVisible ? 'text' : 'password'" placeholder="New Password" required />
            <!-- <button type="button" @click="passwordVisible = !passwordVisible">Toggle</button> -->
            <p v-if="errors.newPassword" class="text-red-500 text-sm">{{ errors.newPassword }}</p>
          </div>
          <div>
            <UiInput id="confirmPassword" v-model="confirmPassword" v-bind="confirmPasswordAttrs"
              :type="confirmPasswordVisible ? 'text' : 'password'" placeholder="Confirm Password" required />
            <!-- <button type="button" @click="confirmPasswordVisible = !confirmPasswordVisible">Toggle</button> -->
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</p>
          </div>
        </div>
        <UiButton type="submit" class="flex h-[45px] w-full justify-center text-[16px] mt-2" :loading="isLoading">
          Submit
        </UiButton>
        </div>
    </form>
    <!-- </div> -->
  </div>
</template>
