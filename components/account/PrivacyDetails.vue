<template>
  <div class="pb-2">
    <form @submit="handleAccountUpdate" class="flex flex-col gap-2">
      <h3 class="mb-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        Privacy
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
        <div class="relative">
          <TextField :type="passwordVisible ? 'text' : 'password'" name="password" label="Password"
            placeholder="Password" :textFieldMaxLength="30" required>
            <template #endIcon>
              <div class="w-[30px] cursor-pointer mt-[7px]" @click="togglePasswordVisibility" type="button">
                <OpenEye v-if="passwordVisible" />
                <CloseEyeIcon v-else />
              </div>
            </template>
          </TextField>
        </div>
        <div class="relative ">
          <TextField :type="confirmPasswordVisible ? 'text' : 'password'" name="confirmPassword"
            label="Confirm Password" placeholder="Confirm Your Password" :textFieldMaxLength="30" required>
            <template #endIcon>
              <div class="w-[30px] cursor-pointer mt-[7px]" @click="toggleConfirmPasswordVisibility" type="button">
                <OpenEye v-if="confirmPasswordVisible" />
                <CloseEyeIcon v-else />
              </div>
            </template>
          </TextField>
        </div>
      </div>

      <div class="flex w-full justify-end">
        <UiButton type="submit" color="primary" size="lg" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
  import { privacySchema } from "~/validationSchema/account/privacySchema";

  const {
    errors,
    setErrors,
    setFieldValue,
    handleSubmit,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: privacySchema,
    initialValues: {
    },
  });

  const passwordVisible = ref(false);
  const confirmPasswordVisible = ref(false);
  const isLoading = ref(false)


  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
  const toggleConfirmPasswordVisibility = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  };

  const handleAccountUpdate = handleSubmit(async () => {
    isLoading.value = true
    try {
      await $fetch("/api/user", { method: "PUT", body: values });
      toast.success("Password updated successfully");
      resetForm()
    } catch (e) {
      console.error(e);
      toast.error("Failed to update Password, please try again");
      isLoading.value = false
    }
    isLoading.value = false
  });
</script>
