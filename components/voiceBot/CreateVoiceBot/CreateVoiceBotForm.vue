<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { botCreateSchema } from '~/validationSchema/botManagement/chatBot/createBot';
import { ArrowLeft, Goal } from 'lucide-vue-next';
import { useBotDocuments } from '~/composables/botManagement/chatBot/useBotDocuments';
import { useRoute } from 'vue-router'
import { botStore } from "~/store/botStore";
// import { useBotDetails } from '~/composables/botManagement/chatBot/useBotDetails';
// import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const step = ref(1);
const route = useRoute();
const paramId: any = route;
// const { status, documents, refresh } = useBotDocuments(route.params.id);
const scrapData = botStore();
const isLoading = ref(false)
const stepOneRef = ref(null);
const pageLoading = ref(false)
const isSubmitting = ref(false)
const isDocumentListOpen = ref(false);
const intervalId = ref<any>(null); // Store the interval ID
// const { intentOptions, fetchConfig } = useChatbotConfig();
// const uploadDocumentRef = ref(null);
// const selectedType = ref('')
// ✅ Define a single form
// const { errors, values, handleSubmit, validateField, validate, setFieldValue } = useForm({
//   validationSchema: botCreateSchema,
//   initialValues: {
//     color: hslToHex('236, 61%, 54%, 1'),
//     secondaryColor: hslToHex('236, 61%, 74%'),
//   },
// });
// const { botDetails, loading, error, refreshBot } = useBotDetails(route.params.id);
const showNextButton = computed(() => (step.value < 4));
const showBackButton = computed(() => (step.value === 1))

// ✅ Watch errors for debugging (optional)
// watch(() => scrapData, (newscrapData) => {
//   if (!newscrapData) return;
//   const extractHSLValues = (hslString) => hslString.replace(/hsl\(|\)/g, "");
//   setFieldValue('NAME', newscrapData.scrapedData.chatbot.name ?? '');
//   setFieldValue('COMPANY', newscrapData.scrapedData.brand?.name ?? '');
//   setFieldValue('type', newscrapData.scrapedData.brand?.industry ?? '');
//   setFieldValue('color', hslToHex(extractHSLValues(newscrapData.scrapedData.chatbot.primary_color)) ?? "236, 61%, 54%, 1");
//   setFieldValue('secondaryColor', hslToHex(extractHSLValues(newscrapData.scrapedData.chatbot.secondary_color)) ?? "236, 61%, 74%");
//   setFieldValue('ROLE', 'custom');
//   setFieldValue('GOAL', 'custom');
//   setFieldValue('otherRole', newscrapData.scrapedData.chatbot.role);
//   setFieldValue('logo', { url: newscrapData.scrapedData.brand?.logo_url } ?? {});
//   setFieldValue("otherGoal", newscrapData.scrapedData.chatbot.goal || "");
// }, { deep: true, immediate: true });
// watch(() => botDetails.value, (newDetails) => {
//   if (newDetails) { // Ensure newDetails is not null
//     setFieldValue('BotName', newDetails?.name ?? '');
//   }
// }, { deep: true, immediate: true });

// watch(
//   () => status.value,
//   (newStatus) => {
//     if (((step.value === 1) && values.selectedType === 'Text')) {
//       if (newStatus === "success") {
//         isLoading.value = false;
//         step.value++;
//       }
//     }
//   },
//   { deep: true, immediate: true }
// );
// // setFieldValue('NAME', botDetails.value.name ?? '');
// const isDataLoading = computed(() => status.value === "pending");
// watch(() => scrapData.scrapedData?.knowledge_base?.document_content,(newValue) => {
//   refresh()
// },{deep: true, immediate: true})

// ✅ Fields to validate per step
const stepFields = {
  1: [""], // Assuming validation for step 1 is based on document length
  2: ["BotName", "NAME", "COMPANY", "color", "secondaryColor", "logo", "type"], // Step 2 fields
  3: ["ROLE", "otherRole", "otherGoal"] // Include otherRole and otherGoal for step 3
};


// onMounted(() => {
//   if (botDetails.value) {
//     console.log(botDetails.value, "botDetails.value -- botDetails.value")
//   }
// })
const nextStep = async () => {
  step.value++;
};
const prevStep = () => {
  if (step.value > 1) step.value--;
};
const backRoute = () => {
  navigateTo("/voice-bot");
}
const firstStepBack = () => {
  // setFieldValue('selectedType', '')
}

// const triggerPDFUpload = () => {
//   if (uploadDocumentRef.value) {
//     uploadDocumentRef.value.generatePDFAndUpload();
//   }
// };
</script>

<template>
  <div class="h-[calc(100dvh-2.5rem)] overflow-y-auto">
    <!-- <div>
      <LoadingOverlay :loading="pageLoading" class="w-[80%]" />
    </div> -->
    <div class="flex items-center gap-2 font-bold py-3 px-5">
      <div class="flex items-center gap-2 cursor-pointer" @click="backRoute()">
        <span class="cursor-pointer">
          <component :is="ArrowLeft"></component>
        </span>
        <span class="text-[20px] text-[20px] md:text-[24px]"> Create Voicebot </span>
      </div>
    </div>
    <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
    <!-- <div class="px-6 py-6 pb-0 flex-1 overflow-hidden min-h-[400px] md:min-h-[500px] max-h-[80vh]"> -->
    <!-- <div class="px-6 py-6 pb-0 flex-1 overflow-hidden min-h-[585px] md:min-h-[585px] max-h-[95vh]"> -->
    <div class="px-6 py-6 pb-0 flex-1 overflow-auto min-h-[400px] md:min-h-[500px] h-[calc(100vh-8rem)] max-h-[95vh] flex">
      <!-- <TextDocumentUpload ref="uploadDocumentRef" v-show="false" /> -->
      <form class="border border-gray-300 rounded-lg flex flex-col justify-between h-full flex-1 overflow-auto">
        <!-- @update:values="(newValues) => values = newValues" -->
        <FirstStepVoiceBot ref="stepOneRef" v-show="step === 1" v-model:values="values" :errors="errors" :refresh="refresh" />
        <!-- <SecondStep v-show="step === 2" v-model:values="values" :errors="errors" />
        <ThirdStep v-show="step === 3" v-model:values="values" :errors="errors" :intentOptions="intentOptions" />
        <FourthStep v-show="step === 4" v-model:values="values" :errors="errors" :disabled="isLoading" :intentOptions="intentOptions" /> -->
        <!-- {{ step === 2 && (values.intent.length === 0) }} -->
        <div class="flex justify-end w-full gap-[12px] p-4">
          <UiButton v-if="(step > 1)" :disabled="isLoading" type="button" @click="prevStep" class="px-8" variant="outline">Back</UiButton>
          <UiButton v-if="showBackButton" type="button" @click="firstStepBack" class="px-8" variant="outline">Back
          </UiButton>
          <!-- <UiButton v-if="showNextButton" type="button" @click="nextStep" class="px-8"
            :loading="isDataLoading && isLoading">Next
          </UiButton>
          <UiButton type="button" v-if="step === 4" @click="submitForm" class="px-8" :loading="isLoading">
            Create Bot
          </UiButton> -->
        </div>
      </form>
    </div>
  </div>
</template>
