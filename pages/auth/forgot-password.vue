<script setup lang="ts">
  definePageMeta({
    layout: "auth",
    middleware: "guest-only",
  });
  import { useRoute } from "vue-router";

  const formSchema = toTypedSchema(
    z.object({
      email: z
        .string({ required_error: "Invalid email address." })
        .email("Invalid email address."),
    }),
  );

  const restPasswordSchema = toTypedSchema(
    z
      .object({
        // username: z.string().email("Invalid email address."),
        newPassword: z
          .string({ required_error: "Password is required" })
          .min(6, "Password must be at least 6 characters long."),
        confirmPassword: z
          .string({ required_error: "Confirm is required" })
          .min(6, "Confirm Password must be at least 6 characters long."),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"], // Point to the field that has the issue
      }),
  );

  const schema = ref(formSchema);
  const animationProps = {
    duration: 500,
  };
  const route = useRoute();
  const isLoading = ref(false);
  if (route.query.token) {
    schema.value = restPasswordSchema;
  }
  const {
    setFieldValue,
    handleSubmit,
    errors,
    values,
    defineField,
    resetForm,
  } = useForm({
    validationSchema: schema.value,
    initialValues: {
      // name: "",
    },
  });

  const onSubmit = handleSubmit(async (value: any) => {
    isLoading.value = true;
    if (route.query?.token?.length) {
      authHandlers.resetPassword(value, route.query?.token);
    } else {
      authHandlers.forgotPassword(value);
    }
    isLoading.value = false;
  });

  const passwordVisible = ref(false);
  const confirmPasswordVisible = ref(false);

  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
  const toggleConfirmPasswordVisibility = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  };
</script>
<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div
      class="w-[90%] px-0 pb-[20px] font-bold text-[#424bd1] md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]"
    >
      <span> Forgot Password </span>
    </div>
    <div
      class="flex w-[90%] flex-col px-0 md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]"
    >
      <!-- <div> -->
      <!-- @submit="authHandlers.login" -->
      <form class="space-y-2" @submit="onSubmit">
        <div v-if="route?.query?.token?.length" class="flex flex-col gap-2">
          <div class="relative">
            <TextField
              :type="passwordVisible ? 'text' : 'password'"
              name="newPassword"
              label="Password"
              placeholder="Password"
              required
            >
              <template #endIcon>
                <div
                  class="w-[30px] cursor-pointer"
                  @click="togglePasswordVisibility"
                  type="button"
                >
                  <OpenEye v-if="passwordVisible" />
                  <CloseEyeIcon v-else />
                </div>
              </template>
            </TextField>
          </div>
          <div class="relative">
            <TextField
              :type="confirmPasswordVisible ? 'text' : 'password'"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm Your Password"
              required
            >
              <template #endIcon>
                <div
                  class="w-[30px] cursor-pointer"
                  @click="toggleConfirmPasswordVisibility"
                  type="button"
                >
                  <OpenEye v-if="confirmPasswordVisible" />
                  <CloseEyeIcon v-else />
                </div>
              </template>
            </TextField>
          </div>
        </div>

        <div v-else>
          <TextField
            type="email"
            name="email"
            label="E-mail"
            placeholder="Enter Your Email"
            required
          />
        </div>
        <UiButton
          type="submit"
          class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
          :loading="isLoading"
        >
          Submit
        </UiButton>
      </form>
    </div>
  </div>
</template>
