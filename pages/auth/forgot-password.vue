<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "guest-only",
});
const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Invalid email address."),
  }));
const animationProps = {
  duration: 500,
}
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="font-bold text-[#424bd1] xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0 pb-[20px]">
      <span> Let’s Get Started </span>
    </div>
    <div class="flex flex-col xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0">
      <!-- <div> -->
      <!-- @submit="authHandlers.login" -->
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" class="space-y-2">
        <div class="mb-6">
          <UiFormField v-slot="{ componentField }" name="email">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold">E-mail</UiFormLabel>
              <UiFormControl>
                <UiInput v-bind="componentField" type="Email" placeholder="Enter Your Email" class="font-medium" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>
        <UiButton type="submit" class="flex justify-center w-full bg-[#424bd1] hover:bg-[#424bd1]">Reset
          Password
        </UiButton>
      </UiForm>
    </div>
  </div>
</template>