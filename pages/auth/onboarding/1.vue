<script setup lang="ts">
import { formSchema } from '~/validationSchema/authValidation/onBoarding/1Validation';

  const showCustomRoleInput = ref(false);
  definePageMeta({
    layout: "auth",
  });
  const animationProps = {
    duration: 500,
  };

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



  const roles = [
    "Chief Executive Officer",
    "Chief Financial Officer",
    "Chief Technology Officer",
    "Chief Operating Officer",
    "Chief Information Officer",
    "Chief Marketing Officer",
    "Sales",
    "Other",
  ];

  onMounted(() => {
    const savedForm = localStorage.getItem("onboardingForm");
    if (savedForm) {
      const { name, role, otherRole } = JSON.parse(savedForm);
      setFieldValue("name", name);
      setFieldValue("role", role);
      setFieldValue("otherRole", otherRole);
    }
  });

  // const handleRoleChange = (selectItem: any) => {
  //   if (loginData.role === 'Other') {
  //     showCustomRoleInput.value = true
  //   }
  // }
  // const handleChange = () => {
  //   loginData.customRole = loginData.customRole
  // }
  const onSubmit = handleSubmit(async (value: any) => {
    localStorage.setItem(
      "onboardingForm",
      JSON.stringify({
       ...value
      }),
    );

    await $fetch("/api/auth/onboarding/1", {
      method: "POST",
      body: value,
    });
    return navigateTo("/auth/onboarding/2");
  });
</script>
<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <!-- :initial-values="defaultFormValues" -->
    <!-- @submit="handleSubmit" -->
    <div
      class="w-[90%] px-0 pb-[20px] font-bold text-[#424bd1] md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]"
    >
      Personal Details
    </div>
    <div
      class="flex w-[90%] flex-col px-0 md:w-[80%] lg:w-[90%] lg:px-6 xl:w-[80%]"
    >
      <!-- <div> -->

      <form class="space-y-2" @submit="onSubmit">
        <div class="flex flex-col gap-3">
          <TextField
            type="name"
            name="name"
            label="Full Name"
            placeholder="Enter Your Name"
            :required="true"
          />

          <SelectField
            name="role"
            label="Role"
            placeholder="Select Role"
            :options="roles.map((role) => ({ label: role, value: role }))"
            :required="true"
          />
          <TextField
          v-if="values.role === 'Other'"
            type="name"
            name="otherRole"
            class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium"
            :required="true"
          />
          <UiButton
            type="submit"
            class="flex h-[45px] w-full justify-center bg-[#424bd1] hover:bg-[#424bd1]"
            >Proceed
          </UiButton>
        </div>
      </form>

      <!-- </div> -->
    </div>
    <div class="absolute bottom-[30px] flex items-center gap-1">
      <span class="text-[12px] text-[#8a8a8a]">
        By Signing up, I Agree to Tring AI
      </span>
      <a
        target="_blank"
        href="https://tringlabs.ai/terms-and-conditions"
        class="text-[12px] underline"
      >
        Terms & Conditions
      </a>
    </div>
  </div>
</template>
