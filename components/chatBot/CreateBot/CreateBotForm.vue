<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { botCreateSchema } from '~/validationSchema/botManagement/chatBot/createBot';
import { ArrowLeft, Goal } from 'lucide-vue-next';
import { useBotDocuments } from '~/composables/botManagement/chatBot/useBotDocuments';
import { useRoute } from 'vue-router'
import { botStore } from "~/store/botStore";
import { useBotDetails } from '~/composables/botManagement/chatBot/useBotDetails';

const step = ref(1);
const route = useRoute();
const { status, documents, refresh } = useBotDocuments(route.params.id);
const scrapData = botStore();
const isLoading = ref(false)
const stepOneRef = ref(null);
// const uploadDocumentRef = ref(null);
// const selectedType = ref('')
// ✅ Define a single form
const { errors, values, handleSubmit, validateField, validate, setFieldValue } = useForm({
  validationSchema: botCreateSchema,
  initialValues: {
    type: 'real-estate',
    color: hslToHex('236, 61%, 54%, 1'),
    secondaryColor: hslToHex('236, 61%, 74%'),
  },
});
const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
const showNextButton = computed(() => step.value < 4 && values.value.selectedType);
// ✅ Watch errors for debugging (optional)
watch(errors, (newErrors) => {
  console.log(newErrors, "Validation Errors");
});
watch(() => scrapData, (newscrapData) => {
  if (!newscrapData) return;
  const extractHSLValues = (hslString) => hslString.replace(/hsl\(|\)/g, "");
  setFieldValue('NAME', newscrapData.scrapedData.chatbot.name ?? '');
  setFieldValue('COMPANY', newscrapData.scrapedData.brand?.name ?? '');
  setFieldValue('color', hslToHex(extractHSLValues(newscrapData.scrapedData.chatbot.primary_color)) ?? "236, 61%, 54%, 1");
  setFieldValue('secondaryColor', hslToHex(extractHSLValues(newscrapData.scrapedData.chatbot.secondary_color)) ?? "236, 61%, 74%");
  setFieldValue('ROLE', 'custom');
  setFieldValue('GOAL', 'custom');
  setFieldValue('otherRole', newscrapData.scrapedData.chatbot.role);
  setFieldValue('logo', { url: newscrapData.scrapedData.brand?.logo_url } ?? {});
  setFieldValue("otherGoal", newscrapData.scrapedData.chatbot.goal || "");
}, { deep: true, immediate: true });


// watch(() => scrapData.scrapedData?.knowledge_base?.document_content,(newValue) => {
//   refresh()
// },{deep: true, immediate: true})

// ✅ Fields to validate per step
const stepFields = {
  1: [""], // Assuming validation for step 1 is based on document length
  2: ["NAME", "COMPANY", "color", "secondaryColor", "logo", "type"], // Step 2 fields
  3: ["ROLE", "otherRole", "otherGoal"] // Include otherRole and otherGoal for step 3
};


const nextStep = async () => {
  console.log(documents.value.documents.length, "documents.value - -documents.value")
  const fieldsToValidate = stepFields[step.value] || [];
  let isValid = true;

  // Validate each field in the current step individually
  for (const field of fieldsToValidate) {
    const { valid } = await validateField(field);
    if (!valid) {
      isValid = false;
    }
  }
  console.log(documents.value, "documents -- documents -  ")
  // if ((step.value === 1) && values.selectedType === 'Text') {
  //   if (uploadDocumentRef.value) {
  //     uploadDocumentRef.value.generatePDFAndUpload();
  //   }
  // }
  if ((step.value === 1) && values.selectedType === 'Text') {
    if (stepOneRef.value?.uploadDocumentRef?.generatePDFAndUpload) {
      stepOneRef.value.uploadDocumentRef.generatePDFAndUpload(); // Call function from TextDocumentUpload
  } else {
    console.log("Function not found!");
  }
}
  if ((step.value === 1) && !documents.value.documents.length) {
    toast.error("Please provide at least one document");
    return
  }

  if ((step.value === 2) && !values.type) {
    toast.error("Please select an industry before proceeding.");
    return
  }
  if (step.value === 3) {
    if (!values.ROLE) {
      toast.error("Please provide a value for Role");
      return; // Stop execution if ROLE is missing
    }

    if (values.ROLE === 'custom' && !values.otherRole) {
      toast.error("Please provide a custom value for Role");
      return;
    }
  }

  // console.log(values, "values")
  // if ((step.value === 1) && (values.intent.length === 0)) {
  //   toast.error("Please select at least one intent");
  //   return
  // }
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

const firstStepBack = () => {
  setFieldValue('selectedType', '')
}

// const triggerPDFUpload = () => {
//   if (uploadDocumentRef.value) {
//     uploadDocumentRef.value.generatePDFAndUpload();
//   }
// };
// ✅ Final form submission
const submitForm = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    if (!values.COMPANY || !values.NAME || !values.ROLE || !values.color) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!values.GOAL) {
      toast.error("Please provide a value for Goal");
      return
    } 
    if (values.GOAL === 'custom' && !values.otherGoal) {
      toast.error("Please provide a custom value for Goal");
      return
    }

    // console.log(values, "values");
    // console.log(botDetails.value, "botDetails.value -- botDetails.value")
    // console.log(botDetails.value.id, "botDetails.value.id -- botDetails.value.id")

    const payload = {
      id: botDetails.value.id,
      metadata: {
        ui: {
          ...botDetails.value.metadata.ui,
          logo: values.logo,
          color: hexToHSL(values.color),
          secondaryColor: hexToHSL(values.secondaryColor),
        },
        prompt: {
          ...botDetails.value.metadata.prompt,
          COMPANY: values.COMPANY,
          NAME: values.NAME,
          ROLE: values.ROLE,
          GOAL: values.GOAL,
          otherRole: values.otherRole,
          otherGoal: values.otherGoal,
        },
      },
    };

    await updateBotDetails(payload);

    toast.success("Bot details updated successfully!");
  } catch (error) {
    console.error("Error updating bot details:", error);
    toast.error("Something went wrong. Please try again.");
  }
  // isLoading.value = false
});

</script>

<template>
  <div class="h-[calc(100dvh-2.5rem)] overflow-y-auto">
    <div class="flex items-center gap-2 font-bold py-3 px-5">
      <div class="flex items-center gap-2 cursor-pointer" @click="backRoute()">
        <span class="cursor-pointer">
          <component :is="ArrowLeft"></component>
        </span>
        <span class="text-[20px] text-[20px] md:text-[24px]"> Create Chatbot </span>
      </div>
    </div>
    <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
    <!-- <div class="px-6 py-6 pb-0 flex-1 overflow-hidden min-h-[400px] md:min-h-[500px] max-h-[80vh]"> -->
    <!-- <div class="px-6 py-6 pb-0 flex-1 overflow-hidden min-h-[585px] md:min-h-[585px] max-h-[95vh]"> -->
    <div class="px-6 py-6 pb-0 flex-1 overflow-hidden h-[585px] md:h-[585px] max-h-[95vh] flex">
      <!-- <TextDocumentUpload ref="uploadDocumentRef" v-show="false" /> -->
      <form class="border border-gray-300 rounded-lg flex flex-col justify-between h-full flex-1 overflow-auto">
        <!-- @update:values="(newValues) => values = newValues" -->
        <FirstStep ref="stepOneRef" v-show="step === 1" v-model:values="values" :errors="errors" />
        <SecondStep v-show="step === 2" v-model:values="values" :errors="errors" />
        <ThirdStep v-show="step === 3" v-model:values="values" :errors="errors" />
        <FourthStep v-show="step === 4" v-model:values="values" :errors="errors" />
        <!-- {{ step === 2 && (values.intent.length === 0) }} -->
        <div class="flex justify-end w-full gap-[12px] p-4">
          <UiButton v-if="(step > 1)" type="button" @click="prevStep" class="px-8" variant="outline">Back</UiButton>
          <UiButton v-if="(step === 1) && values.selectedType" type="button" @click="firstStepBack" class="px-8"
            variant="outline">Back
          </UiButton>
          <UiButton v-if="(step < 4) && values.selectedType" type="button" @click="nextStep" class="px-8">Next
          </UiButton>
          <UiButton type="button" v-if="step === 4" @click="submitForm" class="px-8" :loading="isLoading">
            Create Bot
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>
