<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';
import { useContentSuggestions } from "~/composables/botManagement/chatBot/useContentSuggestions";
import { useVoicebotKnowledgeBase } from '~/composables/botManagement/voiceBot/useVoicebotKnowledgeBase';
import { botStore } from "~/store/botStore";
import { voiceBotCreateSchema } from '~/validationSchema/botManagement/voiceBot/createVoiceBotValidation';
// import { useVoiceBotDetails } from "~/composables/botManagement/voiceBot/useVoiceBotDetails ";

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
const pendingNavigation = ref<string | null>(null);
const bypassConfirmation = ref(false);
const showLeaveConfirmation = ref({
  default: false,
});
// const { botDetails,loading, error: botErrors, refreshBot } = useVoiceBotDetails(paramId.params.id);

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
    // await fetchConfig(newType)
    // await fetchKnowledgeBase(newType)
    scrapData.voiceBotScrapedData = []
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


onBeforeRouteLeave((to, from, next) => {
  // Skip confirmation if already loading/submitting
  if (isLoading.value || isSubmitting.value || bypassConfirmation.value) {
    next();
    return;
  }

  // Store the full path we want to navigate to
  pendingNavigation.value = to.fullPath;
  showLeaveConfirmation.value.default = true;
  next(false);
});
onMounted(() => {
  localStorage.removeItem('voiceBotScrapedData');
})
// Clean up
onUnmounted(() => {
  localStorage.removeItem('voiceBotScrapedData');
  window.removeEventListener('popstate', () => { });
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
    scrapData.scrapedData = [];
  }
});

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
  // if ((step.value === 1)) {
  //   if (values.selectedType === 'Text') {
  //     if (!stepOneRef.value.uploadDocumentRef.text) {
  //       toast.error("Please provide Knowledge Details.");
  //       isValid = false;
  //     }
  //   }
  //   // console.log('stepOneRef.value.uploadDocumentRef.text', stepOneRef.value.uploadDocumentRef)
  // }

  // Special handling for step 1 (Knowledge Details)
  if (step.value === 1) {
    if (values.selectedType === 'Text') {
      if (!stepOneRef.value.uploadDocumentRef.text) {
        toast.error("Please provide Knowledge Details.");
        isValid = false;
      }
    } else if (values.selectedType === 'Website') {
      // Check if we have website data either in store or localStorage
      let hasWebsiteData = false;

      // First check store
      if (scrapData.voiceBotScrapedData?.document_content) {
        hasWebsiteData = true;
      } else {
        // Try localStorage as fallback
        try {
          const savedData = localStorage.getItem('voiceBotScrapedData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData && parsedData.document_content) {
              hasWebsiteData = true;

              // Optionally restore to store
              if (!scrapData.voiceBotScrapedData) {
                scrapData.voiceBotScrapedData = parsedData;
                console.log("Restored website data from localStorage to store");
              }
            }
          }
        } catch (err) {
          console.error("Error checking localStorage for website data:", err);
        }
      }

      if (!hasWebsiteData) {
        toast.error("Please import website data first.");
        isValid = false;
      }
    }
  }


  if (step.value === 2) {
    await fetchConfig(values.type)
  }
  // Special handling for step 3 (Role)
  if (step.value === 3) {
    if (!values.role) {
      toast.error("Please provide a value for Role");
      isValid = false;
    } else if (values.role === 'custom' && !values.otherRole) {
      toast.error("Please provide a custom value for Role");
      isValid = false;
    }
  }

  // Special handling for step 4 (Goal)
  if (step.value === 4) {
    if (!values.goal) {
      toast.error("Please provide a value for goal");
      isValid = false;
    } else if (values.goal === 'custom' && !values.otherGoal) {
      toast.error("Please provide a custom value for Goal");
      isValid = false;
    }
  }

  // Special handling for step 5 (STT, TTS, LLM config)
  if (step.value === 5) {
    // STT provider validation
    if (!values.provider_stt) {
      toast.error("Please select an STT provider");
      isValid = false;
    } else {
      // STT provider-specific fields
      if (values.provider_stt === 'deepgram' && (!values.deepmodel || values.deepmodel.length === 0)) {
        toast.error("Please select a model for Deepgram STT provider");
        isValid = false;
      }

      if (values.provider_stt === 'google' && (!values.googlemodel || values.googlemodel.length === 0)) {
        toast.error("Please select a model for Google STT provider");
        isValid = false;
      }
    }

    // TTS provider validation
    if (!values.provider_tts) {
      toast.error("Please select a TTS provider");
      isValid = false;
    } else {
      // TTS provider-specific fields
      if (values.provider_tts === 'google' && (!values.name || values.name.length === 0)) {
        toast.error("Please enter a name for Google TTS provider");
        isValid = false;
      }

      if (values.provider_tts === 'elevenlabs') {
        if (!values.elevenlabsvoice || values.elevenlabsvoice.length === 0) {
          toast.error("Please select a voice for ElevenLabs TTS provider");
          isValid = false;
        }

        if (!values.model || values.model.length === 0) {
          toast.error("Please select a model for ElevenLabs TTS provider");
          isValid = false;
        }
      }

      if (values.provider_tts === 'deepgram' && (!values.deepgramvoice || values.deepgramvoice.length === 0)) {
        toast.error("Please select a voice for Deepgram TTS provider");
        isValid = false;
      }

      // For other providers that require voice selection
      if (!['tring', 'deepgram', 'google'].includes(values.provider_tts) &&
        (!values.voice || values.voice.length === 0)) {
        toast.error(`Please select a voice for ${values.provider_tts} TTS provider`);
        isValid = false;
      }
    }

    // LLM configuration validation
    if (!values.max_output_token) {
      toast.error("Please select the maximum output tokens");
      isValid = false;
    }
  }

  // Only proceed if all validations pass
  if (isValid) {
    // Update field values and move to next step
    nextTick(() => {
      if (values.boundDirection) {
        setFieldValue('boundDirection', values.boundDirection);
      }
    });

    // Preserve boundDirection explicitly when moving to next step
    step.value++; // Move to next step only if validation passes
  }
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

const handleLeaveConfirm = async () => {
  try {
    // Cleanup first
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
    if (scrapData.scrapedData) {
      scrapData.scrapedData = [];
    }

    // Store the navigation path before cleanup
    const path = pendingNavigation.value;

    // Close dialog and clear pending navigation
    showLeaveConfirmation.value.default = false;
    localStorage.removeItem('voiceBotScrapedData');
    pendingNavigation.value = null;

    // Perform navigation
    if (path) {
      window.location.href = path;
      // Delete bot after navigation
    }
  }
  catch (error) {
    try {
      // Multiple fallback strategies
      if (document.referrer) {
        await navigateTo(document.referrer);
      } else {
        await navigateTo('/chat-bot');
      }
    } catch (fallbackError) {
      // Absolute last resort
      window.location.href = '/chat-bot';
    }
  }
};
// Cancel navigation
const handleLeaveCancel = () => {
  showLeaveConfirmation.value.default = false;
  pendingNavigation.value = null;
};

const submitForm = handleSubmit(async (values) => {
  // Set submission state to true
  isSubmitting.value = true;
  bypassConfirmation.value = true;

  // Clear the cancel dialog if it's showing
  handleLeaveCancel();

  if (!values.provideraccountname) {
    isSubmitting.value = false;
    bypassConfirmation.value = false;
    return toast.error('Please select a provider account name');
  }
  if (!values.incomingPhoneNumber) {
    isSubmitting.value = false;
    bypassConfirmation.value = false;
    return toast.error('Please enter an incoming phone number');
  }

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
    provider: values.provider_tts || 'google', // Default to 'google'
    integratedTtsProvider: values.provider_tts || 'google',
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
  else if (!["tring", "google", "deepgram"].includes(values.provider_tts)) {
   updatedTTSConfig.provider = "elevenlabs"
    const elevenlabsConfig:any = {
      voice: values.voice || values.elevenlabsvoice || "",
      model: values.model || "eleven_turbo_v2",
    };
    updatedTTSConfig.provider = "elevenlabs"
    const TTSIntegrationList:any = await $fetch("/api/tts-integration", { method: "GET"}) || {}
    
    const TTSIntegration = [...TTSIntegrationList].find((item: any) => item.ttsIntegrationName === values.provider_tts)
    updatedTTSConfig.integratedTtsProvider === TTSIntegration?.ttsIntegrationName || values.provider_tts

    if (TTSIntegration.metadata?.apiKey) {
      elevenlabsConfig.api_key = TTSIntegration.metadata.apiKey
    }

    // Always include these parameters regardless of model
    elevenlabsConfig.stability = 0.5;
    elevenlabsConfig.similarity_boost = 1;

    // Only include style and use_speaker_boost if the model is eleven_multilingual_v2
    if (values.model === 'eleven_multilingual_v2') {
      elevenlabsConfig.style = 0.5;
      elevenlabsConfig.use_speaker_boost = false;
    }

    updatedTTSConfig.elevenlabs = elevenlabsConfig;
  }
  else if (values.provider_tts === "deepgram") {
    // Deepgram config
    updatedTTSConfig.deepgram = {
      voice: values.deepgramvoice || "aura-asteria-en",
    }
  }
  else if (values.provider_tts === "tring") {
    updatedTTSConfig.tring = {
      speed: 1,
      speaker: "",
      silence_pad: 250,
      api_key: "",
    }
  }

  // Get knowledge base content based on selectedType
  let knowledgeBaseContent = null;

  if (values.selectedType === 'Text') {
    // For Text type, only use the text from the component
    knowledgeBaseContent = stepOneRef.value.uploadDocumentRef.text;
  } else if (values.selectedType === 'Website') {
    // For Website type, try store first, then localStorage
    if (scrapData.voiceBotScrapedData?.document_content) {
      knowledgeBaseContent = scrapData.voiceBotScrapedData.document_content;
    } else {
      // Try from localStorage as fallback for Website type
      try {
        const savedData = localStorage.getItem('voiceBotScrapedData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData && parsedData.document_content) {
            knowledgeBaseContent = parsedData.document_content;
          }
        }
      } catch (err) {
        console.error("Error reading from localStorage:", err);
      }
    }
  }

  // In case knowledgeBaseContent is still null after all checks
  if (!knowledgeBaseContent) {
    console.warn("No knowledge base content found in any source");
    knowledgeBaseContent = "";  // Set to empty string to avoid null errors
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
    knowledgeBase: knowledgeBaseContent,
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

  try {
    // Create the bot
    const newBot = await $fetch(`/api/voicebots`, {
      method: "POST",
      body: payload,
    });

    // Set active status for deployment
    const activateBot = true;

    // Deploy the bot
    try {
      const deployedBot = await $fetch(`/api/voicebots/${newBot.id}/deploy`, {
        method: "PUT",
        body: {
          active: activateBot,
        },
      });

      if (deployedBot.active) {
        // Direct navigation without confirmation dialog
        await navigateTo({
          name: "voice-bot-id",
          params: { id: newBot.id },
        });

        scrapData.createBotVoiceSuccessfulState.open = true;
        scrapData.createBotVoiceSuccessfulState.handleContent = false;
        setTimeout(() => {
          toast.success("Activated successfully");
          localStorage.removeItem('voiceBotScrapedData');
        }, 2000);
      } else {
        isSubmitting.value = false;
        bypassConfirmation.value = false;
        toast.error("Deactivation failed");
      }
    } catch (error) {
      isSubmitting.value = false;
      bypassConfirmation.value = false;
      toast.error(error.statusMessage || "Error deploying bot");
    }
  } catch (error) {
    isSubmitting.value = false;
    bypassConfirmation.value = false;
    toast.error(error.statusMessage || "Error creating bot");
  }
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
    <div
      class="px-6 py-6 pb-0 flex-1 overflow-auto min-h-[400px] md:min-h-[500px] md:max-h-[80vh] h-[calc(100vh-8rem)] max-h-[95vh] flex">
      <form class="border border-gray-300 rounded-lg flex flex-col justify-between h-full flex-1 overflow-auto">
        <FirstStepVoiceBot ref="stepOneRef" v-show="step === 1" v-model:values="values" :errors="errors"
          :suggestionsContent="knowledgeBaseData" :refreshSuggestions="fetchKnowledgeBase" :loading="voiceKnowLoader" />
        <SecondStepVoiceBot v-show="step === 2" v-model:values="values" :errors="errors" />
        <ThirdStepVoiceBot v-show="step === 3" v-model:values="values" :errors="errors"
          :intentOptions="intentOptions" />
        <FourthStepVoiceBot v-show="step === 4" v-model:values="values" :errors="errors"
          :intentOptions="intentOptions" />
        <FifthStepVoiceBot v-show="step === 5" v-model:values="values" :errors="errors"
          :intentOptions="intentOptions" />
        <SixthStepVoiceBot v-show="step === 6" v-model:values="values" :errors="errors"
          :intentOptions="intentOptions" />
        <div class="flex justify-end w-full gap-[12px] p-4 mt-3">
          <UiButton v-if="(step > 1)" :disabled="isLoading" type="button" @click="prevStep"
            class="px-8 button_shadow border border-[#FFBC42] text-[#FFBC42] hover:text-[#FFBC42] rounded-lg"
            variant="outline">Back</UiButton>
          <UiButton v-if="showBackButton" type="button" @click="firstStepBack"
            class="px-8 button_shadow border border-[#FFBC42] text-[#FFBC42] hover:text-[#FFBC42] rounded-lg"
            variant="outline">Back
          </UiButton>
          <UiButton v-if="showNextButton" type="button" @click="nextStep" color="primary"
            class="px-8 button_shadow rounded-lg" :loading="isLoading">Next
          </UiButton>
          <!-- isDataLoading || isUploading -->
          <UiButton color="primary" type="button" v-if="step === 6" @click="submitForm"
            class="px-8 button_shadow rounded-lg" :loading="isLoading">
            Create Bot
          </UiButton>
        </div>
      </form>
    </div>
    <CancelorNot v-model:open="showLeaveConfirmation.default" title="Exit Voicebot Creation?"
      description="You're in the middle of creating a voicebot. If you leave now, any unsaved changes will be lost. Do you want to continue?"
      @confirm="handleLeaveConfirm" @cancel="handleLeaveCancel" />
  </div>
</template>
