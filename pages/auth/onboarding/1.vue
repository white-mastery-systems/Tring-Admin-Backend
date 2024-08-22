<script setup lang="ts">
const showCustomRoleInput = ref(false)
definePageMeta({
  layout: "auth",
});
const animationProps = {
  duration: 500,
};
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(2, "Role must be provided."),
    otherRole: z.string().optional().default(""),
  }).refine(
    (data: any) => {
      if (data.role.toLowerCase() === "other") {
        return data.otherRole.length >= 1;
      }
      return true;
    },
    {
      message: "Other role must be provided",
      path: ["otherRole"],
    },
  ).transform((data: any) => {
    if (data.role.toLowerCase() === "other") {
      return { ...data, role: data.otherRole };
    }
    return data;
  })
)

const roles = ['Chief Executive Officer', 'Chief Financial Officer', 'Chief Technology Officer', 'Chief Operating Officer', 'Chief Information Officer', 'Chief Marketing Officer', 'Sales', 'Other']

// const handleRoleChange = (selectItem: any) => {
//   if (loginData.role === 'Other') {
//     showCustomRoleInput.value = true
//   }
// }
// const handleChange = () => {
//   loginData.customRole = loginData.customRole
// }
const onSubmit = async (value: any) => {
  await $fetch("/api/auth/onboarding/1", {
    method: "POST",
    body: value,
  });
  return navigateTo("/auth/onboarding/2");
};
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <!-- :initial-values="defaultFormValues" -->
    <!-- @submit="handleSubmit" -->
    <div class="font-bold text-[#424bd1] xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0 pb-[20px]">Personal
      Details</div>
    <div class="flex flex-col xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0">
      <!-- <div> -->
      <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" @submit="onSubmit"
        class="space-y-4">
        <UiFormField v-slot="{ componentField }" name="name">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold"> Full Name <UiLabel class="text-red-500 text-lg">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter your Name"
                class="h-[50px] font-regular border-none bg-[#F6F6F6]" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <!-- <div class="flex gap-4 mb-4"> -->
        <UiFormField v-slot="{ componentField }" name="role">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold">Role <UiLabel class="text-red-500 text-lg">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger class="h-[50px] border-0 bg-[#FFFFFF] field_shadow">
                  <UiSelectValue placeholder="Select Role" class="font-medium" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem v-for="(role, index) in roles" :value="role">{{
                    role
                    }}</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
              <UiFormField v-if="componentField.modelValue === 'Other'" v-slot="{ componentField }" name="otherRole">
                <UiFormItem v-auto-animate="animationProps" class="w-full">
                  <UiFormControl>
                    <UiInput v-bind="componentField" type="text" class="h-[50px]" />
                  </UiFormControl>
                  <UiFormMessage />
                </UiFormItem>
              </UiFormField>
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500">This will determine the role of the bot and behavior.</span>
          </UiFormItem>
        </UiFormField>
        <!-- </div> -->
        <UiButton type="submit" class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110 w-full" size="lg">Proceed
        </UiButton>
      </UiForm>
      <!-- </div> -->
    </div>
    <div class="absolute flex items-center bottom-[30px] gap-1">
      <span class="text-[#8a8a8a] text-[12px]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-and-conditions" class="text-[12px] underline"> Terms &
        Conditions </a>
    </div>
  </div>
</template>