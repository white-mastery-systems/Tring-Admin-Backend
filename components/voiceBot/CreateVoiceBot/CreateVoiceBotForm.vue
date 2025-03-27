<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { voiceBotCreateSchema } from '~/validationSchema/botManagement/voiceBot/createVoiceBotValidation';
import { ArrowLeft } from 'lucide-vue-next';
import { useBotDocuments } from '~/composables/botManagement/chatBot/useBotDocuments';
import { useRoute } from 'vue-router'
import { botStore } from "~/store/botStore";
import { useContentSuggestions } from "~/composables/botManagement/chatBot/useContentSuggestions";
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';
import { useVoicebotKnowledgeBase } from '~/composables/botManagement/voiceBot/useVoicebotKnowledgeBase';
import { useVoiceBotDetails } from "~/composables/botManagement/voiceBot/useVoiceBotDetails ";

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
const { knowledgeBaseData, status,voiceKnowLoader, error: knowledgeBaseError, fetchKnowledgeBase } = useVoicebotKnowledgeBase();
const { botDetails,loading, error: botErrors, refreshBot } = useVoiceBotDetails(paramId.params.id);

const { errors, values, handleSubmit, validateField, validate, setFieldValue } = useForm({
  validationSchema: voiceBotCreateSchema,
  initialValues: {
    provider_stt: 'deepgram',
    provider_tts: 'deepgram',
    selectedType: '',
    boundDirection: 'inbound',
    max_output_token: '8192',
    temperature: 0.5,
  },
});

watch(() => values.type, async (newType) => {
  if (newType) {
    await fetchConfig(newType)
    await fetchKnowledgeBase(newType)
    // fetchSuggestions(newType)
  }
});
watch(() => scrapData, (newScrapData) => {
  if (!newScrapData) return;
  setFieldValue('type', newScrapData.voiceBotScrapedData?.industry ?? values.type);
}, { deep: true, immediate: true })

watch(errors, (newErrors) => {
  console.log(newErrors, 'newErrors');
})
// watch(() => values.selectedType, (newSelectedType) => {
//   console.log(newSelectedType, 'newSelectedType');
//   if (newSelectedType) {
//     setFieldValue('type', newSelectedType);
//   }
// });
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
  const fieldsToValidate = stepFields[step.value] || [];
  let isValid = true;
  
  // Basic field validation
  for (const field of fieldsToValidate) {
    const { valid } = await validateField(field);
    if (!valid) {
      isValid = false;
    }
  }

  // Special handling for step 1 (Knowledge Details)
  if (step.value === 1) {
    console.log(scrapData.voiceBotScrapedData?.document_content, "scrapData.voiceBotScrapedData?.document_content -- scrapData.voiceBotScrapedData?.document_content")
    if (scrapData.voiceBotScrapedData?.document_content?.length === 0 || !scrapData.voiceBotScrapedData?.document_content) {
      toast.error("Please provide Knowledge Details.");
      return;
    }
  }

  // Special handling for step 3 (Role)
  if (step.value === 3) {
    if (!values.role) {
      toast.error("Please provide a value for Role");
      return;
    }

    if (values.role === 'custom' && !values.otherRole) {
      toast.error("Please provide a custom value for Role");
      return;
    }
  }
  
  // Special handling for step 4 (Goal)
  if (step.value === 4) {
    if (!values.goal) {
      toast.error("Please provide a value for goal");
      return;
    }
    if (values.goal === 'custom' && !values.otherGoal) {
      toast.error("Please provide a custom value for Goal");
      return;
    }
  }

  // Special handling for step 5 (STT, TTS, LLM config)
  if (step.value === 5) {
    // STT provider validation
    if (!values.provider_stt) {
      toast.error("Please select an STT provider");
      return;
    }

    // STT provider-specific fields
    if (values.provider_stt === 'deepgram' && (!values.deepmodel || values.deepmodel.length === 0)) {
      toast.error("Please select a model for Deepgram STT provider");
      return;
    }

    if (values.provider_stt === 'google' && (!values.googlemodel || values.googlemodel.length === 0)) {
      toast.error("Please select a model for Google STT provider");
      return;
    }

    // TTS provider validation
    if (!values.provider_tts) {
      toast.error("Please select a TTS provider");
      return;
    }

    // TTS provider-specific fields
    if (values.provider_tts === 'google' && (!values.name || values.name.length === 0)) {
      toast.error("Please enter a name for Google TTS provider");
      return;
    }

    if (values.provider_tts === 'elevenlabs') {
      // if (!values.apikey || values.apikey.length === 0) {
      //   toast.error("Please enter an API Key for ElevenLabs TTS provider");
      //   return;
      // }

      if (!values.elevenlabsvoice || values.elevenlabsvoice.length === 0) {
        toast.error("Please select a voice for ElevenLabs TTS provider");
        return;
      }

      if (!values.model || values.model.length === 0) {
        toast.error("Please select a model for ElevenLabs TTS provider");
        return;
      }
    }

    if (values.provider_tts === 'deepgram' && (!values.deepgramvoice || values.deepgramvoice.length === 0)) {
      toast.error("Please select a voice for Deepgram TTS provider");
      return;
    }

    // For other providers that require voice selection
    if (!['tring', 'deepgram', 'google'].includes(values.provider_tts) &&
      (!values.voice || values.voice.length === 0)) {
      toast.error(`Please select a voice for ${values.provider_tts} TTS provider`);
      return;
    }

    // LLM configuration validation
    if (!values.max_output_token) {
      toast.error("Please select the maximum output tokens");
      return;
    }
  }

  // Update field values and move to next step
  nextTick(() => {
    if (values.boundDirection) {
      setFieldValue('boundDirection', values.boundDirection);
    }
  });

  // Preserve boundDirection explicitly when moving to next step
  step.value++; // Move to next step
}
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
watch(() => values.type,(newType, oldType) => {
  if (newType !== oldType) {
    setFieldValue('role', '')
    setFieldValue('goal', '')
  }
})
watch(() => values.provideraccountname,(newName, oldName) => {
  if (newName !== oldName) {
    setFieldValue('incomingPhoneNumber', '')
  }
})
const firstStepBack = () => {
  const currentBoundDirection = values.boundDirection; // Store current value
  setFieldValue('selectedType', '');
  setFieldValue('boundDirection', currentBoundDirection); // Restore value
}
const submitForm = handleSubmit(async (values) => {
  // STT config

  const updatedConfig: any = {
    // language: value.language || botData.value?.speechToTextConfig.language || "en-IN",
    provider: values.provider_stt || botData.value?.speechToTextConfig.provider || 'deepgram',
  };
  // Google config
  if (values.provider_stt === "google") {
    updatedConfig.google = {
      model: values.googlemodel || 'short',
      adaptation: true,
      phrase_sets: [],
      amplification_factor: 2,
      recognizer: '',
    };
  }

  // Azure config
  else if (values.provider_stt === "azure") {
    updatedConfig.azure = {
      phrase_list: [],
      amplification_factor: 2,
    };
  }

  // Deepgram config
  else if (values.provider_stt === "deepgram") {
    updatedConfig.deepgram = {
      model: values.deepmodel || 'nova-2',
      keywords: [],
      endpointing: 300,
      utterance_end_ms: '1000',
      amplification_factor: 2,
    };
  }
  // AssemblyAI config
  else if (values.provider_stt === "assemblyai") {
    updatedConfig.assemblyai = {
      word_boost: [],
      end_utterance_silence_threshold: 300,
      amplification_factor: 2,
    };
  }

// TTS config

  const updatedTTSConfig = {

    // Use submitted provider or fallback to existing one
    provider: values.provider_tts || botDetails.value?.textToSpeechConfig.provider || 'google', // Default to 'google'
  };
  // Google config
  if (values.provider_tts === 'google') {
    updatedTTSConfig.google = {
      // ...botData.value?.textToSpeechConfig.google, // Keep existing Google config
      name: values.name || "en-IN-Neural2-A",
      speaking_rate: 1,
      pitch: 1,
      volume_gain_db: 0.5,
    }
  }
  else if (values.provider_tts !== 'tring' && values.provider_tts !== 'google' && values.provider_tts !== 'deepgram') {
   
    const elevenlabsConfig = {
      voice: values.elevenlabsvoice || "",
      model: values.model || "eleven_turbo_v2",
    };

    // Always include these parameters regardless of model
    elevenlabsConfig.stability = 0.5;
    elevenlabsConfig.similarity_boost = 1;

    // Only include style and use_speaker_boost if the model is eleven_multilingual_v2
    if (values.model === 'eleven_multilingual_v2') {
      elevenlabsConfig.style = 0.5;
      elevenlabsConfig.use_speaker_boost = false;
    }

    // Set the API key if provided
    // if (values.apikey) {
    //   elevenlabsConfig.api_key = values.apikey;
    // }

    updatedTTSConfig.elevenlabs = elevenlabsConfig;

  }
  else if (values.provider_tts === "deepgram") {
    // Deepgram config
    updatedTTSConfig.deepgram = {
      // ...botData.value?.textToSpeechConfig.deepgram, // Keep existing Deepgram config
      voice: values.deepgramvoice || "aura-asteria-en",
      // amplification_factor: values.amplificationFactor !== undefined ? values.amplificationFactor : botData.value?.textToSpeechConfig.deepgram.amplification_factor || 2,
      // Add any other necessary Deepgram-specific fields similarly
    }
  }
  else if (values.provider_tts === "tring") {
    updatedTTSConfig.tring = {
      // ...botData.value?.textToSpeechConfig.deepgram, // Keep existing Deepgram config
      speed: 1,
      speaker: "",
      silence_pad: 250,
      api_key: "",
    }
  }

  // Prepare the payload
  const payload = {
    name: values.newBotName,
    ivrConfig: values.provideraccountname ?? null,
    incomingPhoneNumber: values.incomingPhoneNumber ?? null,
    botDetails: {
      agentName: values.agentName,
      agentLanguage: values.agentLanguage,
      region: values.region,
      timezone: values.timezone,
      role: values.role,
      goal: values.goal,
      callType: values.boundDirection,
      industryType: values.type,
    },
    textToSpeechConfig: updatedTTSConfig,
    speechToTextConfig: updatedConfig,
    knowledgeBase: scrapData.voiceBotScrapedData?.document_content,
    llmConfig: {
      top_k: "40",
      top_p: "0.95",
      prompt: "",
      inboundPrompt: {},
      outboundPrompt: {},
      temperature: values.temperature,
      max_output_token: values.max_output_token,
    },

  }

  console.log('Payload:', payload);
  await updateLLMConfig(payload, paramId.params.id, "The voice bot has been integraded successfully.");
  // if (!values.provideraccountname) {
  //   toast.error("Please provide a value for Role");
  // } else {
  //   toast.error("Please provide account name ");
  // }
})
onUnmounted(() => {
  scrapData.voiceBotScrapedData = []
})
</script>

<template>
  <div class="h-[calc(100dvh-2.5rem)] overflow-y-auto">
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
        <FirstStepVoiceBot ref="stepOneRef" v-show="step === 1" v-model:values="values" :errors="errors" :suggestionsContent="knowledgeBaseData" :refreshSuggestions="fetchKnowledgeBase" :loading="voiceKnowLoader" />
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
