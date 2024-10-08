<template>
  <div class="w-full">
    <component :is="currentStepComponent" :formData="formData" :personalCompanyDetail="values" @next="nextStep" @prev="prevStep" :errors="errors"
      :setFieldValue="setFieldValue" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate'; // Assuming you're using vee-validate
import companyDetailForm from '~/components/onBoardingStepForm/companyDetailForm.vue';
import personalDetailForm from '~/components/onBoardingStepForm/personalDetailForm.vue';
import { personalDetailFormValidation } from '~/validationSchema/authValidation/onBoarding/1Validation';
import { companyDetailValidation } from '~/validationSchema/authValidation/onBoarding/2Validation';

const steps = [personalDetailForm, companyDetailForm];
const currentStepIndex = ref(0);
const errors = ref({}); // Store errors from useForm
const formData = ref({}); // Store form data

const currentValidationSchema = computed(() => {
  return currentStepIndex.value === 0 ? personalDetailFormValidation : companyDetailValidation;
});
const {
  setFieldValue,
  handleSubmit,
  resetForm,
  values,
} = useForm({
  validationSchema: currentValidationSchema,
  initialValues: formData.value,
});

const nextStep = handleSubmit(async (data) => {
  try {
    // Store data for this step
    formData.value = { ...formData.value, ...data };

    // Move to the next step
    if (currentStepIndex.value < steps.length - 1) {
      currentStepIndex.value++;
    } else {
      // Perform the API request in a try block
      await $fetch('/api/auth/onboarding', {
        method: 'POST',
        body: formData.value,
      });

      // Navigate to success page
      navigateTo("/signUpSuccess");

      // Optionally redirect to the homepage after 3 seconds
      setTimeout(() => {
        navigateTo("/");
      }, 3000);
    }
  } catch (error) {
    toast.error("Something went wrong while submitting your details. Please try again.");
  }
});

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

const currentStepComponent = computed(() => steps[currentStepIndex.value]);
</script>
