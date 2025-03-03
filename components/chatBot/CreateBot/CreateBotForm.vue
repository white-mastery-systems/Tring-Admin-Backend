<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
// import * as yup from 'yup';
// import FirstStep from '@/components/CreateBot/FirstStep.vue';
// import SecondStep from '@/components/CreateBot/SecondStep.vue';
// import ThirdStep from '@/components/CreateBot/ThirdStep.vue';
import { companyDetailsSchema } from '~/validationSchema/account/companyDetails';

const step = ref(1);

// ✅ Define a single form
const { errors, values, handleSubmit, validate } = useForm({
  validationSchema: companyDetailsSchema,
  initialValues: {
    paymentMethod: 'card',
    logo: null,
    companyName: '',
    industry: '',
    otherRole: '',
    avgTraffic: '',
    buisnessName: '',
    employeeCount: '',
    gst: '',
  },
});
watch(errors, (newError) => {
  console.log(newError, "newError-- newError");
})
// ✅ Check validation before moving to the next step
const nextStep = async () => {
  let fieldsToValidate = [];

  if (step.value === 1) fieldsToValidate = ["name", "logo"];
  if (step.value === 2) fieldsToValidate = ["industry", "avgTraffic"];
  if (step.value === 3) fieldsToValidate = ["employeeCount", "gst"];

  const results = await Promise.all(fieldsToValidate.map((field) => validateField(field)));

  // Proceed if all fields for the step are valid
  if (results.every((r) => r.valid)) {
    step.value++;
  }
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};
// ✅ Final form submission
const submitForm = handleSubmit((values) => {
  console.log('Final Form Data:', values);
});
</script>

<template>
  <form class="space-y-2">
    <FirstStep v-if="step === 1" :values="values" :errors="errors" />
    <SecondStep v-if="step === 2" :values="values" :errors="errors" />
    <ThirdStep v-if="step === 3" :values="values" :errors="errors" />

    <div class="text-right">
      <UiButton v-if="step > 1" type="button" @click="prevStep">Back</UiButton>
      <UiButton v-if="step < 3" type="button" @click="nextStep">Next</UiButton>
      <UiButton v-if="step === 3" type="button" @click="submitForm" color="primary" size="lg">Submit</UiButton>
    </div>
  </form>
</template>
