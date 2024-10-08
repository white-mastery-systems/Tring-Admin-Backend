<script setup lang="ts">
import { formSchema } from '~/validationSchema/authValidation/onBoarding/2Validation';

  const showCustomRoleInput = ref(false);

  definePageMeta({
    layout: "auth",
  });
  const router = useRouter();
  const isLoading = ref(false)
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
  const industry = [
    "Real Estate",
    "Finance",
    "Healthcare",
    "Technology",
    "Education",
    "Other",
  ];
  const avgTraffic = [
    "Less than 100 visits",
    "100-500 visits",
    "500-1000 visits",
    "1000-5000 visits",
    "5000-10000 visits",
    "10000+ visits",
  ];
  const employeeCount = [
    "Less than 10 employees",
    "10-50 employees",
    "50-100 employees",
    "100-500 employees",
    "500-1000 employees",
    "1000+ employees",
  ];

   const {
    errors,
    setErrors,
    setFieldValue,
    handleSubmit,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: formSchema,
    initialValues: {
      // firstName: "",
      // lastName: "",
      // phone: "",
      // countryCode: "",
    },
  });
  setFieldValue("industry","Real Estate")
  setFieldValue("avgTraffic","Less than 100 visits")
  setFieldValue("employeeCount","Less than 10 employees")

 const onSubmit = handleSubmit(async (value: any) => {
    // if (loginData.name.length < 1) {
    //   toast.error("Please enter valid details");
    //   return;
    // }
   isLoading.value = true
   try {
    await $fetch("/api/auth/onboarding/2", {
      method: "POST",
      body: value,
    });
    navigateTo("/signUpSuccess");
    setTimeout(() => {
      navigateTo("/");
    }, 3000)
   } catch (error) {
    isLoading.value = false
     console.error("Error during submission:", error);
   }
   isLoading.value = false
  })
</script>
<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="flex w-[80%] items-center gap-1 px-[21px] pb-[20px] font-bold text-[#424bd1]">
      <div class="flex gap-2 cursor-pointer" @click="router.back()">
        <RightArrow />
        <span> Company Details </span>
      </div>
    </div>
    <div class="flex w-[80%] flex-col overflow-y-auto px-6">
      <form class="space-y-2" @submit="onSubmit">
        <div class="flex flex-col gap-3">
          <TextField type="text" name="name" label="Company Name" placeholder="Enter your Company Name"
            :required="true" />

          <SelectField name="industry" label="Industry" placeholder="Select Role"
            :options="industry.map((role) => ({ label: role, value: role }))" :required="true" />
          <TextField v-if="values.industry === 'Other'" type="text" name="otherRole" :required="true" />

          <SelectField name="avgTraffic" label="Monthly Website Traffic" placeholder="Select Traffic"
            :options="avgTraffic.map((role) => ({ label: role, value: role }))" :required="true" />

          <SelectField name="employeeCount" label="No. of Employees " placeholder="Select Employees"
            :options="employeeCount.map((role) => ({ label: role, value: role }))" :required="true" />

          <UiButton type="submit" class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
            :loading="isLoading">Proceed
          </UiButton>
        </div>
      </form>
      <div class="flex items-center justify-center gap-1 mt-2">
        <span class="text-[12px] text-[#8a8a8a]">
          By Signing up, I Agree to Tring AI
        </span>
        <a target="_blank" href="https://tringlabs.ai/terms-and-conditions" class="text-[12px] underline">
          Terms & Conditions
        </a>
      </div>
    </div>
  </div>
</template>