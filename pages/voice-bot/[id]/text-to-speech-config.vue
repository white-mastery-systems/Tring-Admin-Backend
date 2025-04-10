<template>
  <Page title="Text To Speech Configurations" :bread-crumbs="[
    
  ]">
    <div class="pb-2 sm:pb-0">
      <form @submit.prevent="onSubmit" class="space-y-10">
        <div class="flex flex-col gap-2">
          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
            <SelectField name="provider" label="Provider" placeholder="Select provider"
              helperText="Select your provider." :options="providers" required />
              <!-- {{providers}} -->
            <!-- <SelectField v-if="values.provider === 'google'" name="language" label="Language"
            placeholder="Select language" helperText="Select your language." :options="languageList" required /> -->
            <!-- <SelectField name="voiceType" label="Voice Type" placeholder="Select Voice Type"
            helperText="Select your voiceType." :options="voiceTypes" required /> -->
            <!-- {{values}} || asdad -->
            <TextField v-if="values.provider === 'google'" type="text" label="Name" name="name" required
              placeholder="Name" />
            <TextField v-if="(values.provider === 'tring')" type="text"
              label="API Key" name="apikey" required placeholder="API Key" @input="apikeyunmasking($event)" />
          <!-- </div>
          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"> -->
            <TextField v-if="(values.provider === 'tring')" type="text" label="Speaker" name="speaker" required
              placeholder="Speaker" />
            <!-- <TextField v-if="values.provider === 'tring'" type="number" label="Sample Rate" name="sampleRate" required
              placeholder="Sample Rate" disableCharacters /> -->
            <!-- <TextField v-if="values.provider === 'elevenlabs'" type="text" label="Model" name="model" required
              placeholder="Model" /> -->
              <!-- {{formattedElevenlabsVoiceList}} || formattedElevenlabsVoiceList -->
               <!-- {{formattedElevenlabsVoiceList}} || formattedElevenlabsVoiceList -->
                <!-- {{formattedElevenlabsVoiceList}} || formattedElevenlabsVoiceList -->
            <SelectField v-if="values.provider != 'tring' && values.provider != 'google' && values.provider != 'deepgram'" name="model" label="Model" placeholder="Model"
              helperText="Select your model." :options="formattedElevenlabsModelList" required />
              
            <SelectField v-if="values.provider != 'tring' && values.provider != 'google' && values.provider != 'deepgram'" label="voice" name="elevenlabsvoice" :options="formattedElevenlabsVoiceList" required
              placeholder="voice" />
            <SelectField v-if="(values.provider != 'tring' && values.provider != 'google' && values.provider != 'deepgram') && values.model === ('eleven_multilingual_v2')" name="useSpeakerBoost" :options="useSpeakerBooster"
              label="Use Speaker Boost" placeholder="Use Speaker Boost" required>
            </SelectField>
          </div>
          <RangeSlider v-if="values.provider === 'google'" :step="0.05" :name="parseFloat(values.speakingRate)"
            label="Speaking Rate" @update="($event) => {
              setFieldValue('speakingRate', $event);
            }
              " required placeholder="Enter speaking rate" min="0" max="4" />
          <!-- <TextField type="rangeSlider" label="Speaking Speed" name="speakingSpeed" @input="($event) => {
              const numericValue = Number($event.target.value)
              setFieldValue('speakingSpeed', numericValue)
            }" required disableCharacters /> -->
          <!-- <div class="flex gap-2 grid grid-cols-2"> -->
          <RangeSlider v-if="values.provider === 'tring' || ((values.provider != 'google' && values.provider != 'deepgram'))" :step="0.05" :name="parseFloat(values.speakingSpeed)"
            label="Speaking Speed" @update="($event) => {
                setFieldValue('speakingSpeed', $event);
              }
                " required min="0" max="2" />
          <RangeSlider v-if="values.provider === 'tring'" :step="0.05" :name="parseFloat(values.silence_pad)"
            label="Silence Pad" @update="($event) => {
                setFieldValue('silence_pad', $event);
              }
                " required min="0" max="2500" />
          <!-- </div> -->
          <!-- <TextField v-if="values.provider === 'google'" label="Speaking Rate" name="speakingRate" required placeholder="Enter speaking Rate" -->
          <!-- disableCharacters /> -->

          <RangeSlider v-if="values.provider === 'google'" :step="0.05" :name="parseFloat(values.pitch)"
            label="Enter Pitch" @update="($event) => {
              setFieldValue('pitch', $event);
            }
              " required min="0" max="20" />
          <RangeSlider v-if="values.provider === 'google'" :step="0.05" :name="parseFloat(values.volumeGainDb)"
            label="Volume Gain  DB" @update="($event) => {
              setFieldValue('volumeGainDb', $event);
            }
              " required min="0" max="16" />
          <!-- <TextField
            v-if="values.provider === 'google'"
            label="volume Grain DB"
            name="volumeGainDb"
            required
            placeholder="Enter volume Grain DB"
            disableCharacters
          /> -->

          <RangeSlider v-if="values.provider != 'tring' && values.provider != 'google' && values.provider != 'deepgram'" :step="0.05" :name="parseFloat(values.stability)"
            label="Stability" @update="($event) => {
              setFieldValue('stability', $event);
            }
              " required min="0" max="1" />

          <RangeSlider v-if="values.provider != 'tring' && values.provider != 'google' && values.provider != 'deepgram'" :step="0.05" :name="parseFloat(values.similarityBoost)"
            label="Similarity Boost" @update="($event) => {
              setFieldValue('similarityBoost', $event);
            }
              " required min="0" max="1" />
          <RangeSlider v-if="(values.provider != 'tring' && values.provider != 'google' && values.provider != 'deepgram') && values.model === ('eleven_multilingual_v2')" :step="0.05" :name="parseFloat(values.style)"
            label="Style" @update="($event) => {
              setFieldValue('style', $event);
            }
              " required min="0" max="1" />
          <!-- <RangeSlider
            v-if="values.provider === 'elevenlabs'"
            :step="0.1"
            :name="parseFloat(values.stability )"
            label="Similarity boost"
            @update="
              ($event) => {
                setFieldValue('similarityBoost', $event.toString());
              }
            "
            required
            placeholder="Enter speaking Rate"
            min="0"
            max="0.5"
          /> -->

          <!-- <TextField
            v-if="values.provider === 'elevenlabs'"
            label="Stability"
            name="stability"
            required
            placeholder="Stability"
            disableCharacters
          /> -->
          <!-- <TextField
            v-if="values.provider === 'elevenlabs'"
            label="Similarity Boost"
            name="similarityBoost"
            required
            placeholder="Similarity boost"
            disableCharacters
          /> -->
          <!-- <TextField
            v-if="values.provider === 'elevenlabs'"
            label="Style"
            name="style"
            required
            placeholder="Style"
            disableCharacters
          /> -->
          <!-- <TextField v-if="values.provider === 'elevenlabs'" label="Use Speaker Boost" name="useSpeakerBoost" required
            placeholder="Use Speaker Boost" disableCharacters /> -->
          <SelectField v-if="values.provider === 'deepgram'" name="voice" label="Voice" placeholder="Select voice"
            helperText="Select your voice." :options="voices" required />
        </div>
        <div class="flex w-full justify-end mt-4">
          <UiButton color="primary" :loading="isLoading">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { textToSpeechValidation } from "~/validationSchema/textToSpeechValidation";
import { LanguageList } from '~/composables/useLanguageList';
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useIntegrations } from '@/composables/botManagement/voiceBot/useTtsIntegrations';
import { useElevenLabsVoices } from '@/composables/botManagement/voiceBot/useElevenLabsTTSIntegration';
import { useElevenLabsModels } from '@/composables/botManagement/voiceBot/useElevenLabsModelsComposable';
const route = useRoute("voice-bot-id-text-to-speech-config");
const breadcrumbStore = useBreadcrumbStore();


const { data: botData, status: botLoadingStatus } = await useLazyFetch<{
  textToSpeechConfig: Record<string, string>;
}>(`/api/voicebots/${route.params.id}`);

const { 
  integrationsData, 
  status, 
  integrationRefresh,
  page,
  totalPageCount,
  totalCount
} = useIntegrations({});
const formattedElevenlabsVoiceList = ref();
const formattedElevenlabsModelList = ref();

const isLoading = ref(false);
const refreshModelsFn = ref();
const refreshVoicesFn = ref();
// const { elevenlabsVoiceList, loading, error, refreshVoices } = useElevenLabsVoices(integrationsData.value[0]?.metadata?.apikey);
// const botData = await $fetch(`/api/voicebots/` + route.params.id);
// const { data: botData, status: botLoadingStatus } = await useLazyFetch <{ speechToTextConfig: Record < string, string>}> (`/api/voicebots/${route.params.id}`)
// Correct implementation for watching integration data
// watch(integrationsData, (newIntegrationsData) => {
//   console.log(newIntegrationsData, "newIntegrationsData -- newIntegrationsData")
//   if (newIntegrationsData && newIntegrationsData[0]?.metadata?.apikey) {
//     const apiKey = newIntegrationsData[0].metadata.apikey;
    
//     // Initialize the composables with the current API key
//     const { elevenlabsVoiceList, loading: voicesLoading, error: voicesError, refreshVoices } = useElevenLabsVoices(apiKey);
    
//     // Make sure to destructure the model results properly
//     const { elevenlabsModelList, loading: modelsLoading, error: modelsError, refreshModels } = useElevenLabsModels(apiKey);
    
//     // Store refresh functions
//     refreshVoicesFn.value = refreshVoices;
//     refreshModelsFn.value = refreshModels;

//     // Watch for voices
//     watch(() => elevenlabsVoiceList.value, (newVoiceList) => {
//       if (newVoiceList && newVoiceList?.voices) {
//         formattedElevenlabsVoiceList.value = newVoiceList?.voices.map((voice: any) => ({
//           label: voice.name,
//           value: voice.voice_id,
//         }));
//       } else {
//         console.log("Voice data not yet loaded");
//       }
//     }, {immediate: true});
    
//     // Watch for models with improved logging
//     watch(() => elevenlabsModelList.value, (newModelList) => {
//       // Add checks to see what structure you're working with
//       if (newModelList) {
//         // Try to determine the correct property path
//         if (Array.isArray(newModelList)) {
//           formattedElevenlabsModelList.value = newModelList.map((model) => ({
//             label: model.name,
//             value: model.model_id,
//           }));
//         } else if (newModelList.models) {
//           formattedElevenlabsModelList.value = newModelList.models.map((model) => ({
//             label: model.name,
//             value: model.model_id,
//           }));
//         } else {
//           console.log("Unknown model list structure:", newModelList);
//         }
//       } else {
//         console.log("Model data not yet loaded");
//       }
//     }, {immediate: true});
//   }
// }, { deep: true, immediate: true });

// First, set up a reactive reference to store the currently selected provider
const selectedProvider = ref(null);
const { handleSubmit, setFieldValue, values, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(textToSpeechValidation),
  initialValues: {},
});
// Keep track of the current API key to avoid redundant reinitializations
const currentApiKey = ref(null);

// Listen for changes in the selected provider and fetch the appropriate API key
watch([() => values.provider, integrationsData], ([newSelectedProvider, newIntegrationsData]) => {
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
        refreshVoicesFn.value = refreshVoices;
        refreshModelsFn.value = refreshModels;
        
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
        }, {immediate: true});
        
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
        }, {immediate: true});
      }
    } else {
      console.log("No API key found for provider:", newSelectedProvider);
      // Reset lists when no API key is available
      formattedElevenlabsVoiceList.value = [];
      formattedElevenlabsModelList.value = [];
    }
  }
}, { deep: true, immediate: true });

// You need to update selectedProvider.value when the user selects a provider
const onProviderChange = (provider) => {
  selectedProvider.value = provider;
};

const defaultProviders = [
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

const useSpeakerBooster = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];
// const languages = [
//   {
//     label: "En-US",
//     value: "en-US",
//   },
//   {
//     label: "En-IN",
//     value: "en-IN",
//   },
//   {
//     label: "Hindi",
//     value: "hi-IN",
//   },
//   {
//     label: "Tamil",
//     value: "ta-IN",
//   },
// ];
const { languageList } = LanguageList();
const voiceTypes = [
  {
    label: "Hindi Female",
    value: "hi-IN-Neural2-A",
  },
  {
    label: "En-IN",
    value: "hi-IN-Neural2-B",
  },
  {
    label: "Hindi",
    value: "hi-IN-Neural2-C",
  },
  {
    label: "Tamil",
    value: "hi-IN-Neural2-D	",
  },
];
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
// const elevenlabsVoiceList = ref([])
const botDetails = ref(await getVoiceBotDetails(route.params.id));


const providers = ref([...defaultProviders]);

// Watch for changes in integration data
watch([status, integrationsData], ([newStatus, newData]) => {

  console.log(newData, "newData -- newData -- newData")
  // Only proceed if we have successful data
  if (newStatus === 'success' && Array.isArray(newData)) {
    try {
      console.log(newData, "newData - -newData")
      // Find ElevenLabs integration if it exists
      // const elevenLabsIntegration = newData.find(
      //   integration => integration.provider === 'elevenlabs'
      // );
      const elevenLabsIntegrations = newData.filter(
        integration => integration.provider === 'elevenlabs'
      );
      
      // If we found any ElevenLabs integrations
      if (elevenLabsIntegrations.length > 0) {
        // Make a copy of the current providers
        const updatedProviders = [...defaultProviders];
        
        // Add each ElevenLabs integration to the providers
        elevenLabsIntegrations.forEach(integration => {
          updatedProviders.push({
            label: integration?.ttsIntegrationName || 'ElevenLabs',
            value: integration?.ttsIntegrationName || 'elevenlabs',
          });
        });
        
        // Update the providers ref
        providers.value = updatedProviders;
      } else {
        // If no ElevenLabs integrations, just use default providers
        providers.value = [...defaultProviders];
      }
    } catch (error) {
      console.error("Error processing integration data:", error);
      // On error, revert to default providers
      providers.value = [...defaultProviders];
    }
  }
}, { immediate: true });
breadcrumbStore.setBreadcrumbs([
  {
    label: 'Text To Speech Configurations',
    to: `/voice-bot/${botDetails.value?.id}`,
  },
  {
    label: `${botDetails.value?.name}`,
    to: `/voice-bot/${botDetails.value?.id}/text-to-speech-config`,
  },
]);

watch(botData, () => {
  // setFieldValue("language", botData.value.speechToTextConfig.language);
  setFieldValue("provider", botData.value?.textToSpeechConfig.provider);

  setFieldValue("pitch", botData.value?.textToSpeechConfig?.google.pitch);
  setFieldValue("name", botData.value?.textToSpeechConfig?.google.name);
  setFieldValue("elevenlabsvoice", botData.value?.textToSpeechConfig?.elevenlabs.voice);
  setFieldValue("model", botData.value?.textToSpeechConfig?.elevenlabs.model);
  if (botData.value?.textToSpeechConfig.voiceType) {
    setFieldValue("voice", botData.value?.textToSpeechConfig.voiceType);
  }
  setFieldValue("speakingRate", botData.value?.textToSpeechConfig?.google.speaking_rate);
  setFieldValue("volumeGainDb", botData.value?.textToSpeechConfig?.google.volume_gain_db);
  setFieldValue("stability", botData.value?.textToSpeechConfig?.elevenlabs.stability);
  setFieldValue(
    "similarityBoost",
    botData.value?.textToSpeechConfig?.elevenlabs.similarity_boost,
  );
  setFieldValue("style", botData.value?.textToSpeechConfig?.elevenlabs.style);
  setFieldValue(
    "useSpeakerBoost",
    botData.value?.textToSpeechConfig.elevenlabs.use_speaker_boost,
  );
  setFieldValue("voice", botData.value?.textToSpeechConfig?.deepgram.voice);
  setFieldValue("speaker", botData.value?.textToSpeechConfig?.tring.speaker);
  setFieldValue("speakingSpeed", botData.value?.textToSpeechConfig?.tring.speed);
  setFieldValue("silence_pad", botData.value?.textToSpeechConfig?.tring?.silence_pad || 250);
  if (['tring', 'elevenlabs'].includes(botData.value?.textToSpeechConfig?.provider)) {
    setFieldValue("apikey", botData.value?.textToSpeechConfig[botData.value?.textToSpeechConfig?.provider]?.api_key || '');
  }
  // setFieldValue("sampleRate", botData.value?.textToSpeechConfig?.tring.sample_rate);
}, { deep: true, immediate: true });

watch(
  () => toRaw(values.provider),
  (newValue) => {
    setFieldValue("pitch", botData.value?.textToSpeechConfig?.google.pitch);
    setFieldValue("name", botData.value?.textToSpeechConfig?.google.name);
    setFieldValue("elevenlabsvoice", botData.value?.textToSpeechConfig?.elevenlabs.voice);
    setFieldValue("model", botData.value?.textToSpeechConfig?.elevenlabs.model);
    // if (botData.value?.textToSpeechConfig.voiceType) {
    //   setFieldValue("voiceType", botData.value?.textToSpeechConfig.voiceType);
    // }
    setFieldValue("speakingRate", botData.value?.textToSpeechConfig?.google.speaking_rate);
    setFieldValue("volumeGainDb", botData.value?.textToSpeechConfig?.google.volume_gain_db);
    setFieldValue("stability", botData.value?.textToSpeechConfig?.elevenlabs.stability);
    setFieldValue(
      "similarityBoost",
      botData.value?.textToSpeechConfig?.elevenlabs.similarity_boost,
    );
    setFieldValue("style", botData.value?.textToSpeechConfig?.elevenlabs.style);
    setFieldValue(
      "useSpeakerBoost",
      botData.value?.textToSpeechConfig.elevenlabs.use_speaker_boost,
    );
    setFieldValue("voice", botData.value?.textToSpeechConfig?.deepgram.voice);
    setFieldValue("speaker", botData.value?.textToSpeechConfig?.tring.speaker);
    setFieldValue("speakingSpeed", botData.value?.textToSpeechConfig?.tring.speed);
    setFieldValue("silence_pad", botData.value?.textToSpeechConfig?.tring?.silence_pad || 250);
    if (['tring', 'elevenlabs'].includes(botData.value?.textToSpeechConfig?.provider)) {
      setFieldValue("apikey", botData.value?.textToSpeechConfig[botData.value?.textToSpeechConfig?.provider]?.api_key || '');
    }
    // setFieldValue("sampleRate", botData.value?.textToSpeechConfig?.tring.sample_rate);
  })

watchEffect(() => {
  if (botDetails.value) {
    const userName = botDetails.value?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Text To Speech Config`,
    });
  }
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  const updatedConfig = {

    // Use submitted provider or fallback to existing one
    provider: values.provider || botData.value?.textToSpeechConfig.provider || 'google', // Default to 'google'
  };
  // Google config
  if (values.provider === 'google') {
    updatedConfig.google = {
      // ...botData.value?.textToSpeechConfig.google, // Keep existing Google config
      name: values.name || "en-IN-Neural2-A",
      speaking_rate: values.speakingRate || 1,
          pitch: values.pitch || 1,
            volume_gain_db: values.volumeGainDb || 0.5,
      }
  }
  else if (values.provider !== 'tring' && values.provider !== 'google' && values.provider !== 'deepgram') {
    // ElevenLabs config
  //   updatedConfig.elevenlabs = {
  //     // ...botData.value?.textToSpeechConfig.elevenlabs, // Keep existing Elevenlabs config
  //     api_key: botData.value?.textToSpeechConfig.elevenlabs.api_key || "", // Consider secure handling of API keys
  //       voice: values.elevenlabsvoice || "",
  //         model: values.model || "eleven_turbo_v2",
  //           stability: values.stability || 0.5,
  //           similarity_boost: values.similarityBoost || 1,
  //           style: values.style || 0.5,
  //           use_speaker_boost: values.useSpeakerBoost || false,
  //           // api_key: values.apikey || "",
  //  }
  // ElevenLabs config
  const elevenlabsConfig = {
    // Base required fields
    // api_key: botData.value?.textToSpeechConfig.elevenlabs?.api_key || "",
    voice: values.elevenlabsvoice || "",
    model: values.model || "eleven_turbo_v2",
  };
  
  // Always include these parameters regardless of model
  elevenlabsConfig.stability = values.stability || 0.5;
  elevenlabsConfig.similarity_boost = values.similarityBoost || 1;
  
  // Only include style and use_speaker_boost if the model is eleven_multilingual_v2
  if (values.model === 'eleven_multilingual_v2') {
    elevenlabsConfig.style = values.style || 0.5;
    elevenlabsConfig.use_speaker_boost = values.useSpeakerBoost || false;
  }
  
  // Set the API key if provided
  // if (values.apikey) {
  //   elevenlabsConfig.api_key = values.apikey;
  // }
  
  updatedConfig.elevenlabs = elevenlabsConfig;

  }
  else if (values.provider === "deepgram") {
    // Deepgram config
    updatedConfig.deepgram = {
      // ...botData.value?.textToSpeechConfig.deepgram, // Keep existing Deepgram config
      voice: values.voice || "aura-asteria-en",
       // amplification_factor: values.amplificationFactor !== undefined ? values.amplificationFactor : botData.value?.textToSpeechConfig.deepgram.amplification_factor || 2,
       // Add any other necessary Deepgram-specific fields similarly
     }
  }
  else if (values.provider === "tring") {
    updatedConfig.tring = {
      // ...botData.value?.textToSpeechConfig.deepgram, // Keep existing Deepgram config
      speed: values.speakingSpeed || 1,
      speaker: values.speaker || "",
      silence_pad: values.silence_pad || 250,
      api_key: values.apikey || "",
     }
  }
  // Add other providers as necessary
  // Make the API call with the updated configuration
  await $fetch(`/api/voicebots/${route.params.id}`, {
    method: "PUT",
    body: {
      textToSpeechConfig: updatedConfig,
    },
  });

  toast.success("Updated successfully");
  navigateTo({
    name: "voice-bot-id",
    params: { id: route.params.id },
  });
  isLoading.value = false;
});

const apikeyunmasking = ($event: Event) => {
  const input = $event.target as HTMLInputElement;
  const newInput = input.value.replace(/\*/g, '');
}
</script>
