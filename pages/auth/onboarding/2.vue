<script setup lang="ts">
const showCustomRoleInput = ref(false);

definePageMeta({
  layout: "auth",
});
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Company Name is required'),
    industry: z.string().min(2, "Industry must be provided."),
    avgTraffic: z.string().min(2, 'Monthly Website Traffic must be provided.'),
    employeeCount: z.string().min(2, 'No. of Employees must be provided'),
    otherRole: z.string().optional().default(""),
  }).refine(
    (data: any) => {
      if (data.industry.toLowerCase() === "other") {
        return data.otherRole.length >= 1;
      }
      return true;
    },
    {
      message: "Other role must be provided",
      path: ["otherRole"],
    },
  ).transform((data: any) => {
    if (data.industry.toLowerCase() === "other") {
      return { ...data, industry: data.otherRole };
    }
    return data;
  })
)
const animationProps = {
  duration: 500,
};

const defaultFormValues = reactive({
  name: "",
  industry: "Real Estate",
  customIndustry: "",
  avgTraffic: "Less than 100 visits",
  employeeCount: "Less than 10 employees",
});
const industry = ['Real Estate', 'Finance', 'Healthcare', 'Technology', 'Education', 'Other']
const avgTraffic = ['Less than 100 visits', '100-500 visits', '500-1000 visits', '1000-5000 visits', '5000-10000 visits', '10000+ visits']
const employeeCount = ['Less than 10 employees', '10-50 employees', '50-100 employees', '100-500 employees', '500-1000 employees', '1000+ employees']

const onSubmit = async (value: any) => {
  // if (loginData.name.length < 1) {
  //   toast.error("Please enter valid details");
  //   return;
  // }

  await $fetch("/api/auth/onboarding/2", {
    method: "POST",
    body: value,
  });
  return navigateTo("/DashBoard");
};
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div
      class="text-[#424bd1] xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-[21px] px-0 pb-[20px] flex items-center gap-1 font-bold">
      <RightArrow />
      <span> Company Details </span>
    </div>
    <div class="flex flex-col xl:w-[80%] lg:w-[90%] md:w-[80%] w-[90%] lg:px-6 px-0">
      <UiForm :validation-schema="formSchema" :keep-values="true" :initial-values="defaultFormValues"
        :validate-on-mount="false" @submit="onSubmit" class="space-y-5">
        <UiFormField v-slot="{ componentField }" name="name">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold"> Company Name <UiLabel class="text-red-500 text-lg">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter your Company Name"
                class="h-[50px] font-regular border-none bg-[#F6F6F6]" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <!-- <div class="flex gap-4 mb-4"> -->
        <UiFormField v-slot="{ componentField }" name="industry">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold"> Industry <UiLabel class="text-red-500 text-lg">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger class="h-[50px] border-0 bg-[#FFFFFF] field_shadow">
                  <UiSelectValue class="font-medium" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem v-for="(role, index) in industry" :value="role">{{
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
            <!-- <span class="text-xs text-gray-500">This will determine the role of the bot and behavior.</span> -->
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="avgTraffic">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel class="font-bold"> Monthly Website Traffic <UiLabel class="text-red-500 text-lg">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger class="h-[50px] border-0 bg-[#FFFFFF] field_shadow">
                  <UiSelectValue class="font-medium" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem v-for="(traffic, index) in avgTraffic" :value="traffic">{{
                    traffic
                    }}</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
            <!-- <span class="text-xs text-gray-500">This will determine the role of the bot and behavior.</span> -->
          </UiFormItem>
        </UiFormField>
        <!-- </div> -->
        <div class="mb-[10px]">
          <UiFormField v-slot="{ componentField }" name="employeeCount">
            <UiFormItem v-auto-animate="animationProps" class="w-full">
              <UiFormLabel class="font-bold"> No. of Employees <UiLabel class="text-red-500 text-lg">*</UiLabel>
              </UiFormLabel>
              <UiFormControl>
                <UiSelect v-bind="componentField">
                  <UiSelectTrigger class="h-[50px] border-0 bg-[#FFFFFF] field_shadow">
                    <UiSelectValue class="font-medium" />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <UiSelectItem v-for="(countList, index) in employeeCount" :value="countList">{{
                      countList
                      }}</UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </UiFormControl>
              <UiFormMessage />
              <!-- <span class="text-xs text-gray-500">This will determine the role of the bot and behavior.</span> -->
            </UiFormItem>
          </UiFormField>
        </div>
        <UiButton type="submit" class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110 w-full mt-[15px]" size="lg">
          Proceed
        </UiButton>
      </UiForm>
    </div>
    <div class="absolute bottom-[30px] flex items-center gap-1">
      <span class="text-[#8a8a8a] text-[12px]">
        By Signing up, I Agree to Tring AI
      </span>
      <a target="_blank" href="https://tringlabs.ai/terms-and-conditions" class="text-[12px] underline">
        Terms & Conditions
      </a>
    </div>
  </div>
</template>