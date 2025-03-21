<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { voiceBotCreateSchema } from '~/validationSchema/botManagement/voiceBot/createVoiceBotValidation';
import { ArrowLeft, Goal } from 'lucide-vue-next';
import { useBotDocuments } from '~/composables/botManagement/chatBot/useBotDocuments';
import { useRoute } from 'vue-router'
import { botStore } from "~/store/botStore";
import { useContentSuggestions } from "~/composables/botManagement/chatBot/useContentSuggestions";
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const step = ref(1);
const route = useRoute();
const paramId: any = route;
const scrapData = botStore();
const isLoading = ref(false)
const stepOneRef = ref(null);
const pageLoading = ref(false)
const isSubmitting = ref(false)
const isDocumentListOpen = ref(false);
const intervalId = ref<any>(null); // Store the interval ID
const { contentSuggestions, suggestionLoading, suggestionError, fetchSuggestions } = useContentSuggestions();
const { intentOptions, fetchConfig } = useChatbotConfig();
const showNextButton = computed(() => (step.value < 6) && !!values?.selectedType);
const showBackButton = computed(() => (step.value === 1) && values?.selectedType)

const { errors, values, handleSubmit, validateField, validate, setFieldValue } = useForm({
  validationSchema: voiceBotCreateSchema,
  initialValues: {
    selectedType: '',
    boundDirection: 'inbound',
  },
});

watch(() => values.type, (newType) => {
  if (newType) {
    fetchConfig(newType)
    fetchSuggestions(newType);
  }
});
watch(errors, (newErrors) => {
  console.log(newErrors, 'newErrors');
})
// ✅ Fields to validate per step
const stepFields = {
  1: [""], // Assuming validation for step 1 is based on document length
  2: ["newBotName","agentName","agentLanguage","region","timezone"], // Step 2 fields
  3: [""], // Include otherRole and otherGoal for step 3
  4: [""],
  5: ["provider_stt","provider_tts","max_output_token", "temperature"],
  6: ["",""]
};
const nextStep = async () => {
  console.log(values.boundDirection, "boundDirection -- boundDirection")
  const fieldsToValidate = stepFields[step.value] || [];
  let isValid = true;
  
  // Basic field validation
  for (const field of fieldsToValidate) {
    const { valid } = await validateField(field);
    if (!valid) {
      isValid = false;
    }
  }
  
  // Special handling for step 3 (Role)
  if (step.value === 3) {
    if (!values.ROLE) {
      toast.error("Please provide a value for Role");
      return;
    }

    if (values.ROLE === 'custom' && !values.otherRole) {
      toast.error("Please provide a custom value for Role");
      return;
    }
  }
  
  // Special handling for step 4 (Goal)
  if (step.value === 4) {
    if (!values.GOAL) {
      toast.error("Please provide a value for Goal");
      return;
    }
    if (values.GOAL === 'custom' && !values.otherGoal) {
      toast.error("Please provide a custom value for Goal");
      return;
    }
  }
  
  // Special handling for step 5 (STT, TTS, LLM config)
  if (step.value === 5) {
    // STT provider-specific fields
    if (values.provider_stt === 'deepgram' && (!values.model_stt || values.model_stt.length === 0)) {
      toast.error("Model is required when using Deepgram STT provider");
      isValid = false;
    }
    if (values.provider_stt === 'google' && (!values.googlemodel || values.googlemodel.length === 0)) {
      toast.error("Model is required when using Google STT provider");
      isValid = false;
    }
    
    // TTS provider-specific fields
    if (values.provider_tts === 'google' && (!values.name || values.name.length === 0)) {
      toast.error("Name is required when using Google TTS provider");
      isValid = false;
    }
    
    if (values.provider_tts === 'elevenlabs') {
      if (!values.apikey || values.apikey.length === 0) {
        toast.error("API Key is required when using ElevenLabs TTS provider");
        isValid = false;
      }
      
      if (!values.elevenlabsvoice || values.elevenlabsvoice.length === 0) {
        toast.error("Voice is required when using ElevenLabs TTS provider");
        isValid = false;
      }
      
      if (!values.model || values.model.length === 0) {
        toast.error("Model is required when using ElevenLabs TTS provider");
        isValid = false;
      }
    }
    
    if (values.provider_tts === 'deepgram' && (!values.voice || values.voice.length === 0)) {
      toast.error("Voice is required when using Deepgram TTS provider");
      isValid = false;
    }
  }

  console.log(isValid, 'isValid -- isValid');
  if (isValid) {
    nextTick(() => {
      if (values.boundDirection) {
        setFieldValue('boundDirection', values.boundDirection);
      }
    });
    // Preserve boundDirection explicitly when moving to next step
    step.value++; // Move to next step
  }
};
// watch(values, (newValues) => {
//   console.log('Form values updated:', JSON.stringify({
//     boundDirection: newValues.boundDirection,
//     type: newValues.type,
//     selectedType: newValues.selectedType
//   }));
// }, { deep: true });
const prevStep = () => {
  if (step.value > 1) step.value--;
};
const backRoute = () => {
  navigateTo("/voice-bot");
}
const firstStepBack = () => {
  const currentBoundDirection = values.boundDirection; // Store current value
  setFieldValue('selectedType', '');
  setFieldValue('boundDirection', currentBoundDirection); // Restore value
}
const submitForm = handleSubmit(async (values) => {
  console.log(values, 'values');
  if (!values.provideraccountname) {
    toast.error("Please provide a value for Role");
  } else {
    toast.error("Please provide account name ");
  }
})
</script>

<template>
  <div class="h-[calc(100dvh-2.5rem)] overflow-y-auto">
    <!-- {{values}} || sadsa -->
    <div class="flex items-center gap-2 font-bold py-3 px-5">
      <div class="flex items-center gap-2 cursor-pointer" @click="backRoute()">
        <span class="cursor-pointer">
          <component :is="ArrowLeft"></component>
        </span>
        <span class="text-[20px] text-[20px] md:text-[24px]"> Create Voicebot </span>
      </div>
    </div>
    <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
    <div class="px-6 py-6 pb-0 flex-1 overflow-auto min-h-[400px] md:min-h-[500px] h-[calc(100vh-8rem)] max-h-[95vh] flex">
      <form class="border border-gray-300 rounded-lg flex flex-col justify-between h-full flex-1 overflow-auto">
        <FirstStepVoiceBot ref="stepOneRef" v-show="step === 1" v-model:values="values" :errors="errors" :suggestionsContent="contentSuggestions" :refreshSuggestions="fetchSuggestions" :loading="suggestionLoading" />
        <SecondStepVoiceBot v-show="step === 2" v-model:values="values" :errors="errors" />
        <ThirdStepVoiceBot v-show="step === 3" v-model:values="values" :errors="errors" :intentOptions="intentOptions" />
        <FourthStepVoiceBot v-show="step === 4" v-model:values="values" :errors="errors" :intentOptions="intentOptions" />
        <FifthStepVoiceBot v-show="step === 5" v-model:values="values" :errors="errors" :intentOptions="intentOptions" />
        <SixthStepVoiceBot v-show="step === 6" v-model:values="values" :errors="errors" :intentOptions="intentOptions" />
        <div class="flex justify-end w-full gap-[12px] p-4 mt-3">
          <UiButton v-if="(step > 1)" :disabled="isLoading" type="button" @click="prevStep" class="px-8" variant="outline">Back</UiButton>
          <UiButton v-if="showBackButton" type="button" @click="firstStepBack" class="px-8" variant="outline">Back
          </UiButton>
          <UiButton v-if="showNextButton" type="button" @click="nextStep" class="px-8"
            :loading="isLoading">Next
          </UiButton>
          <!-- isDataLoading || isUploading -->
          <UiButton type="button" v-if="step === 6" @click="submitForm" class="px-8" :loading="isLoading">
            Create Bot
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>
