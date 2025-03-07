<script setup>
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
const createBotsuccessfulState = ref({
  open: false,
});
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
watch(() => scrapData.scrapedData, (newscrapData) => {
  if (!newscrapData || !newscrapData.chatbot) return;
  console.log(newscrapData, "newscrapData");
  console.log(newscrapData, "hexToHSL(extractHSLValues(newscrapData.chatbot.color))")
  const extractHSLValues = (hslString) => hslString.replace(/hsl\(|\)/g, "");
  setFieldValue('NAME', newscrapData.chatbot.name ?? '');
  setFieldValue('COMPANY', newscrapData.brand?.name ?? '');
  setFieldValue('color', hexToHSL(extractHSLValues(newscrapData.chatbot.primary_color)) ?? "236, 61%, 54%, 1");
  setFieldValue('secondaryColor', hexToHSL(extractHSLValues(newscrapData.chatbot.secondary_color)) ?? "236, 61%, 74%");
  setFieldValue('ROLE', 'custom');
  setFieldValue('otherRole', newscrapData.chatbot.role);
  setFieldValue('logo', { url: newscrapData.brand?.logo_url } ?? {});
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
  if ((step.value === 1) && !documents.value.documents.length) {
    toast.error("Please provide at least one document");
    return
  }

  if ((step.value === 2) && !values.type) {
    toast.error("Please select an industry before proceeding.");
    return
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

// ✅ Final form submission
const submitForm = handleSubmit(async (values) => {
  try {
    if (!values.COMPANY || !values.NAME || !values.ROLE || !values.color) {
      toast.error("Please fill in all required fields.");
      return;
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
});

</script>

<template>
  <div class="h-[calc(100dvh-2.5rem)] overflow-y-auto">
    <ChatBotSuccessfulMessageModal v-model="createBotsuccessfulState" @success="() => {
      console.log('on success')
    }" />
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
      <form class="border border-gray-300 rounded-lg flex flex-col justify-between h-full flex-1 overflow-auto">
        <!-- @update:values="(newValues) => values = newValues" -->
        <FirstStep v-show="step === 1" v-model:values="values" :errors="errors" />
        <SecondStep v-show="step === 2" v-model:values="values" :errors="errors" />
        <ThirdStep v-show="step === 3" v-model:values="values" :errors="errors" />
        <FourthStep v-show="step === 4" v-model:values="values" :errors="errors" />
        <!-- {{ step === 2 && (values.intent.length === 0) }} -->
        <div class="flex justify-end w-full gap-[12px] p-4">
          <UiButton v-if="(step > 1)" type="button" @click="prevStep" class="px-8" variant="outline">Back</UiButton>
          <UiButton v-if="(step < 4)" type="button" @click="nextStep" class="px-8">Next</UiButton>
          <UiButton v-if="step === 4" type="button" @click="submitForm" class="px-8">Create Bot
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>
