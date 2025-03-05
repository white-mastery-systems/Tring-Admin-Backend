<script setup>
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { botCreateSchema } from '~/validationSchema/botManagement/chatBot/createBot';
import { ArrowLeft } from 'lucide-vue-next';
const step = ref(1);

// ✅ Define a single form
const { errors, values, handleSubmit, validateField, validate } = useForm({
  validationSchema: botCreateSchema,
  initialValues: {
    industry: 'real-estate',
    intent: [],
  },
});

// ✅ Watch errors for debugging (optional)
watch(errors, (newErrors) => {
  console.log(newErrors, "Validation Errors");
});

// ✅ Fields to validate per step
const stepFields = {
  1: ["companyName", "name", "industry"],
  2: ["industry"],
  // 3: ["employeeCount", "gst"],
};

const nextStep = async () => {
  const fieldsToValidate = stepFields[step.value] || [];
  let isValid = true;

  // Validate each field in the current step individually
  for (const field of fieldsToValidate) {
    const { valid } = await validateField(field);
    if (!valid) {
      isValid = false;
    }
  }
  if ((step.value === 2) && (values.intent.length === 0)) {
    toast.error("Please select at least one intent");
    return
  }
  if (isValid) {
    step.value++; // Move to next step
  } else {
    console.log("Validation failed! Fix errors before proceeding.");
  }
};


const prevStep = () => {
  if (step.value > 1) step.value--;
};
const backRoute = () => {
  navigateTo("/chat-bot");
}

// ✅ Final form submission
const submitForm = handleSubmit((values) => {
  console.log('Final Form Data:', values);
});
</script>

<template>
  <div class="h-[calc(100dvh-2.5rem)] overflow-y-auto">
    <div class="flex items-center gap-2 font-bold py-3 px-5">
      <div class="flex items-center gap-2" @click="backRoute()">
        <span>
          <component :is="ArrowLeft"></component>
        </span>
        <span class="text-[20px] text-[20px] md:text-[24px]"> Create Chatbot </span>
      </div>
    </div>
    <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
    <!-- <div class="px-6 py-6 pb-0 flex-1 overflow-hidden min-h-[400px] md:min-h-[500px] max-h-[80vh]"> -->
    <!-- <div class="px-6 py-6 pb-0 flex-1 overflow-hidden min-h-[585px] md:min-h-[585px] max-h-[95vh]"> -->
    <div class="px-6 py-6 pb-0 flex-1 overflow-hidden h-[585px] md:h-[585px] max-h-[95vh] flex">
      <form class="border border-gray-300 rounded-lg flex flex-col justify-between h-full flex-1 overflow-auto"
        :class="[(step === 3) ? 'p-0 md:relative' : 'p-4']">
        <!-- @update:values="(newValues) => values = newValues" -->
        <FirstStep v-show="step === 1" v-model:values="values" :errors="errors" />
        <SecondStep v-show="step === 2" v-model:values="values" :errors="errors" />
        <ThirdStep v-show="step === 3" v-model:values="values" :errors="errors" />
<!-- {{ step === 2 && (values.intent.length === 0) }} -->
        <div class="flex gap-[12px]"
          :class="[(step === 3) ? 'md:absolute md:bottom-4 md:right-0 justify-end px-4 mb-4 sm:mb-4 md:mb-0' : 'justify-end w-full']">
          <UiButton v-if="step > 1" type="button" @click="prevStep" class="px-8" variant="outline">Back</UiButton>
          <UiButton v-if="step < 3" type="button" @click="nextStep" class="px-8">Next</UiButton>
          <UiButton v-if="step === 3" type="button" @click="submitForm" class="px-8">Create Bot
          </UiButton>
        </div>
      </form>
    </div>

  </div>
</template>
