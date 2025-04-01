<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import { useIntegrations } from '@/composables/botManagement/voiceBot/useTtsIntegrations';
// import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, any>;
  disabled: Record<boolean, any>;
  intentOptions: Record<string, any>;
}>();

const formattedElevenlabsVoiceList = ref();
const formattedElevenlabsModelList = ref();

const emit = defineEmits(["update:values"]);
const { value: temperature } = useField("temperature")
const { value: provider_stt } = useField("provider_stt")
const { value: provider_tts } = useField("provider_tts")
const { value: max_output_token } = useField("max_output_token")
const { value: googlemodel } = useField("googlemodel")
const { value: model } = useField("model")
const { value: voice } = useField("voice")
const { value: name } = useField("name")
const { value: deepmodel } = useField("deepmodel")
const { value: deepgramvoice } = useField("deepgramvoice")
const { value: otherRole, errorMessage: otherRoleError } = useField("otherRole");
const { value: otherGoal, errorMessage: otherGoalError } = useField("otherGoal");

const { 
  integrationsData, 
  status, 
  integrationRefresh,
  page,
  totalPageCount,
  totalCount
} = useIntegrations({});
// const { intentOptions, status, error, fetchConfig } = useChatbotConfig();

const providers = ref([
  {
    label: "Google",
    value: "google",
  },
  {
    label: "Azure",
    value: "azure",
  },
  {
    label: "Deepgram",
    value: "deepgram",
  },
  {
    label: "Assembly Ai",
    value: "assemblyai",
  },
]);
const defaultProvidersTTS = [
  {
    label: "tring",
    value: "tring",
  },
  {
    label: "google",
    value: "google",
  },
  {
    label: "deepgram",
    value: "deepgram",
  },
];
const tokens = ["8192", "1024", "2048", "4096"];
const models = ref([
  {
    label: "Long",
    value: "long",
  },
  {
    label: "Short",
    value: "short",
  },
]);
const deepModal = ref([
  { label: "Nova-2", value: "nova-2" },
  { label: "Nova", value: "nova" },
  { label: "Enhanced", value: "enhanced" },
  { label: "Base", value: "base" },
])
const voices = [
  {
    label: "Asteria English(US)",
    value: "aura-asteria-en",
  },
  {
    label: "Luna English(US)",
    value: "aura-luna-en",
  },
  {
    label: "Stella English (US)",
    value: "aura-stella-en",
  },
  {
    label: "Athena English (UK)	",
    value: "aura-athena-en",
  },
  {
    label: "Orion	English (US)",
    value: "aura-orion-en",
  },
  {
    label: "Arcas	English (US)",
    value: "aura-arcas-en",
  },
  {
    label: "Perseus	English (US)",
    value: "aura-perseus-en",
  },
  {
    label: "Angus	English (Ireland)",
    value: "aura-angus-en",
  },
  {
    label: "Orpheus	English (US)",
    value: "aura-orpheus-en",
  },
  {
    label: "Helios	English (UK)",
    value: "aura-helios-en",
  },
  {
    label: "Zeus	English (US)",
    value: "aura-zeus-en",
  },
];
const providersTTS = ref([...defaultProvidersTTS])
// Watch for all form field changes
watch([
  temperature, 
  provider_stt, 
  provider_tts, 
  max_output_token, 
  googlemodel, 
  deepmodel,
  model, 
  voice, 
  name, 
], () => {
  emit("update:values", {
    ...props.values,
    provider_stt: provider_stt.value,
    provider_tts: provider_tts.value,
    max_output_token: max_output_token.value,
    temperature: temperature.value,
    googlemodel: googlemodel.value,
    model: model.value,
    voice: voice.value,
    name: name.value,
    // ROLE: newValue,
    // otherRole: otherRole.value,
    // otherGoal: otherGoal.value
  });
});

watch([status, integrationsData], ([newStatus, newData]) => {
  // Only proceed if we have successful data
  if (newStatus === 'success' && Array.isArray(newData)) {
    try {
      // Find ElevenLabs integration if it exists
      const elevenLabsIntegration = newData.find(
        integration => integration.provider === 'elevenlabs'
      );
      
      // If we found an ElevenLabs integration, add it to providers
      if (elevenLabsIntegration) {
        // Make a copy of the current providers
        const updatedProviders = [...defaultProvidersTTS];
        
        // Add ElevenLabs with the proper name from the integration
        updatedProviders.push({
          label: elevenLabsIntegration.ttsIntegrationName || 'ElevenLabs',
          value: elevenLabsIntegration.ttsIntegrationName || 'elevenlabs'
        });
        
        // Update the providers ref
        providersTTS.value = updatedProviders;
      } else {
        // If no ElevenLabs integration, just use default providers
        providersTTS.value = [...defaultProvidersTTS];
      }
    } catch (error) {
      // On error, revert to default providers
      providersTTS.value = [...defaultProvidersTTS];
    }
  }
}, { immediate: true });
const currentApiKey = ref(null);
watch([() => provider_tts.value, integrationsData], ([newSelectedProvider, newIntegrationsData]) => {
  if (newSelectedProvider && Array.isArray(newIntegrationsData)) {
    // Find the integration that matches the selected provider
    const selectedIntegration = newIntegrationsData.find(
      integration => integration.ttsIntegrationName === newSelectedProvider ||
        integration.provider === newSelectedProvider
    );
    if (selectedIntegration?.metadata?.apiKey) {
      const apiKey = selectedIntegration.metadata?.apiKey;
      // Only reinitialize if the API key changed
      if (currentApiKey.value !== apiKey) {
        currentApiKey.value = apiKey;

        // Initialize the composables with the selected API key - same as your original code
        const { elevenlabsVoiceList, loading: voicesLoading, error: voicesError, refreshVoices } = useElevenLabsVoices(apiKey);
        const { elevenlabsModelList, loading: modelsLoading, error: modelsError, refreshModels } = useElevenLabsModels(apiKey);

        // Store refresh functions

        // Set up watches for voices and models as in your original code
        watch(() => elevenlabsVoiceList.value, (newVoiceList) => {
          if (newVoiceList) {
            formattedElevenlabsVoiceList.value = newVoiceList?.map((voice) => ({
              label: voice.name,
              value: voice.voice_id,
            }));
          } else {
            console.log("Voice data not yet loaded");
          }
        }, { immediate: true });

        watch(() => elevenlabsModelList.value, (newModelList) => {
          if (newModelList) {
            if (Array.isArray(newModelList)) {
              formattedElevenlabsModelList.value = newModelList?.map((model) => ({
                label: model.name,
                value: model.model_id,
              }));
            } else if (newModelList.models) {
              formattedElevenlabsModelList.value = newModelList.models.map((model) => ({
                label: model.name,
                value: model.model_id,
              }));
            } else {
              console.log("Unknown model list structure:", newModelList);
            }
          } else {
            console.log("Model data not yet loaded");
          }
        }, { immediate: true });
      }
    } else {
      console.log("No API key found for provider:", newSelectedProvider);
      // Reset lists when no API key is available
      formattedElevenlabsVoiceList.value = [];
      formattedElevenlabsModelList.value = [];
    }
  }
}, { deep: true, immediate: true });

const apikeyunmasking = ($event: Event) => {
  const input = $event.target as HTMLInputElement;
  const newInput = input.value.replace(/\*/g, '');
}
// Watch for otherRole and otherGoal change

// watch(() => props.values.type, (newType) => {
//   props.fetchConfig(newType);
// }, { deep: true, immediate: true });
</script>
<template>
  <BotSetupCard title="Bot Details" description="Configure your bot's basic information" currentStep="5" totalSteps="6">
    <div>
      <span class="font-bold text-[12px] sm:text-[12px] md:text-[14px]">Speech-To-Text (STT) Setup</span>
      <div class="grid grid-cols-2 gap-4">
        <SelectField v-model="provider_stt" name="provider_stt" :options="providers" label="Provider"
          placeholder="Select provider"></SelectField>
        <SelectField v-if="provider_stt === 'google'" v-model="googlemodel" name="googlemodel" :options="models"
          label="Model" placeholder="Select Model"></SelectField>
        <SelectField v-if="provider_stt === 'deepgram'" v-model="deepmodel" name="deepmodel" :options="deepModal"
          label="Model" placeholder="Select Model"></SelectField>
      </div>
    </div>
    <div>
      <span class="font-bold text-[12px] sm:text-[12px] md:text-[14px]">Text-To-Speech (TTS) Setup</span>
      <div class="flex items-center grid grid-cols-2 gap-4">
        <SelectField v-model="provider_tts" name="provider_tts" label="Provider" placeholder="Select provider"
          :options="providersTTS" />
        <!-- {{provider_tts}} -->
        <!-- <div v-if="(provider_tts !== 'tring') && (provider_tts !== 'deepgram') && (provider_tts !== 'google')" class="flex flex-col gap-0 pt-3">
               <TextField v-model="apikey" type="text"
               label="API Key" name="apikey" placeholder="API Key" @input="apikeyunmasking($event)" />
               </div> -->
        <!-- <SelectField v-if="provider_tts === 'elevenlabs'" v-model="model" name="model" label="Model" placeholder="Model"
          :options="modalList" /> -->
        <SelectField v-if="provider_tts === 'deepgram'" v-model="deepgramvoice" name="deepgramvoice" label="Voice"
          placeholder="Select voice" :options="voices" />
        <!-- <SelectField v-if="(provider_tts !== 'tring') && (provider_tts !== 'deepgram') && (provider_tts !== 'google')"
          v-model="voice" name="voice" label="Voice" placeholder="Select voice" :options="[]" /> -->
        <SelectField v-if="provider_tts != 'tring' && provider_tts != 'google' && provider_tts != 'deepgram'"
          name="model" label="Model" placeholder="Model"
          :options="formattedElevenlabsModelList" />

        <SelectField v-if="provider_tts != 'tring' && provider_tts != 'google' && provider_tts != 'deepgram'"
          label="voice" name="voice" :options="formattedElevenlabsVoiceList" placeholder="voice" />
        <div class="flex flex-col gap-4 pt-1">
          <TextField class="mt-4" v-if="provider_tts === 'google'" v-model="name" type="text" label="Name" name="name"
            placeholder="Name" />
        </div>
      </div>
    </div>
    <div>
      <span class="font-bold text-[12px] sm:text-[12px] md:text-[14px]">Large Language Model (LLM) Setup</span>
      <div class="grid grid-cols-2 gap-2">
        <SelectField v-model="max_output_token" name="max_output_token" label="Max Tokens" placeholder="Max Tokens"
          :options="tokens.map((token) => ({ label: token, value: token }))" />
        <div class="mt-5 flex flex-col gap-2 pl-3">
          <RangeSlider :step="0.05" :name="temperature" label="AI Response Flexibility"
            @update="($event) => { temperature = $event; }" required placeholder="Enter speaking Rate" min="0"
            max="2" />
        </div>
      </div>
    </div>
  </BotSetupCard>
</template>