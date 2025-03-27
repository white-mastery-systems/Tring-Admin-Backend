<template>
  <!-- <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div> -->
  <div>
    <div class="pb-2 sm:pb-0">
      <form @submit="handleIntegratedSubmit" class="space-y-8">
        <!-- Text-to-Speech Configuration Section -->
        <!-- class="space-y-10" -->
        <div>
          <div class="text-[18px] font-semibold text-[#09090B] pb-6 pt-2">Text-To-Speech (TTS) Setup</div>
          <div class="flex flex-col gap-2">
            <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
              <SelectField name="tts.provider" label="Provider" placeholder="Select provider" :options="ttsProviders" />
              <div v-if="values.tts?.provider === 'google'" class="flex flex-col gap-4 pt-[6px]">
                <TextField type="text" label="Name" name="tts.name"
                  placeholder="Name" />
              </div>
              <TextField v-if="values.tts?.provider === 'tring'" type="text" label="API Key" name="tts.apikey"
                placeholder="API Key" @input="apikeyunmasking($event)" />

              <TextField v-if="values.tts?.provider === 'tring'" type="text" label="Speaker" name="tts.speaker"
                placeholder="Speaker" />

              <SelectField
                v-if="values.tts?.provider !== 'tring' && values.tts?.provider !== 'google' && values.tts?.provider !== 'deepgram'"
                name="tts.model" label="Model" placeholder="Model" :options="formattedElevenlabsModelList" />

              <SelectField
                v-if="values.tts?.provider !== 'tring' && values.tts?.provider !== 'google' && values.tts?.provider !== 'deepgram'"
                label="Voice" name="tts.elevenlabsvoice" :options="formattedElevenlabsVoiceList" placeholder="Voice" />
              <SelectField
                v-if="(values.tts?.provider !== 'tring' && values.tts?.provider !== 'google' && values.tts?.provider !== 'deepgram') && values.tts?.model === ('eleven_multilingual_v2')"
                name="tts.useSpeakerBoost" :options="useSpeakerBooster" label="Use Speaker Boost"
                placeholder="Use Speaker Boost">
              </SelectField>
              <SelectField v-if="values.tts?.provider === 'deepgram'" name="tts.voice" label="Voice"
                placeholder="Select voice" :options="voices" />
            </div>

            <!-- Range Sliders for TTS -->
            <RangeSlider v-if="values.tts?.provider === 'google'" :step="0.05"
              :name="parseFloat(values.tts?.speakingRate)" label="Speaking Rate" @update="($event) => {
                setFieldValue('tts.speakingRate', $event);
              }" placeholder="Enter speaking rate" min="0" max="4" />

            <RangeSlider
              v-if="values.tts?.provider === 'tring' || ((values.tts?.provider !== 'google' && values.tts?.provider !== 'deepgram'))"
              :step="0.05" :name="parseFloat(values.tts?.speakingSpeed)" label="Speaking Speed" @update="($event) => {
                  setFieldValue('tts.speakingSpeed', $event);
                }" min="0" max="2" />

            <RangeSlider v-if="values.tts?.provider === 'tring'" :step="0.05"
              :name="parseFloat(values.tts?.silence_pad)" label="Silence Pad" @update="($event) => {
                  setFieldValue('tts.silence_pad', $event);
                }" min="0" max="2500" />

            <RangeSlider v-if="values.tts?.provider === 'google'" :step="0.05" :name="parseFloat(values.tts?.pitch)"
              label="Enter Pitch" @update="($event) => {
                setFieldValue('tts.pitch', $event);
              }" min="0" max="20" />

            <RangeSlider v-if="values.tts?.provider === 'google'" :step="0.05"
              :name="parseFloat(values.tts?.volumeGainDb)" label="Volume Gain DB" @update="($event) => {
                setFieldValue('tts.volumeGainDb', $event);
              }" min="0" max="16" />

            <RangeSlider
              v-if="values.tts?.provider !== 'tring' && values.tts?.provider !== 'google' && values.tts?.provider !== 'deepgram'"
              :step="0.05" :name="parseFloat(values.tts?.stability)" label="Stability" @update="($event) => {
                setFieldValue('tts.stability', $event);
              }" min="0" max="1" />

            <RangeSlider
              v-if="values.tts?.provider !== 'tring' && values.tts?.provider !== 'google' && values.tts?.provider !== 'deepgram'"
              :step="0.05" :name="parseFloat(values.tts?.similarityBoost)" label="Similarity Boost" @update="($event) => {
                setFieldValue('tts.similarityBoost', $event);
              }" min="0" max="1" />

            <RangeSlider
              v-if="(values.tts?.provider !== 'tring' && values.tts?.provider !== 'google' && values.tts?.provider !== 'deepgram') && values.tts?.model === ('eleven_multilingual_v2')"
              :step="0.05" :name="parseFloat(values.tts?.style)" label="Style" @update="($event) => {
                setFieldValue('tts.style', $event);
              }" min="0" max="1" />

          </div>
        </div>
        <div class="mt-6">
          <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
        </div>
        <!-- LLM Configuration Section -->
        <!-- class="space-y-6 sm:space-y-6 md:space-y-4 lg:space-y-4 xl:space-y-4" -->
        <div class="space-y-6">
          <div class="text-[18px] font-semibold text-[#09090B]">Large Language Model (LLM) Setup</div>
          <div class="grid w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField name="llm.max_output_token" label="Max Tokens" placeholder="Max Tokens"
              :options="tokens.map((token) => ({ label: token, value: token }))" />

            <div class="mt-5 flex flex-col gap-2">
              <RangeSlider :step="0.05" :name="parseFloat(values.llm?.temperature)" label="Temperature" @update="
                ($event) => {
                  setFieldValue('llm.temperature', $event);
                }
              " placeholder="Enter Temperature" min="0" max="2" />
            </div>
          </div>
          <div class="spcace-y-2 grid w-full grid-cols-2 gap-4">
            <TextField name="llm.top_k" label="Top K" placeholder="Enter Top K" />
            <TextField name="llm.top_p" label="Top P" placeholder="Enter Top P" />
          </div>
          <!-- <div class="spcace-y-2 grid w-full grid-cols-1 gap-2">
            <TextField label="System Prompt" name="llm.prompt" placeholder="Enter prompt" :isTextarea="true" />
          </div> -->
        </div>
        <div>
          <UiSeparator orientation="horizontal" class="bg-[#E2E8F0]" />
        </div>
        <!-- Speech-to-Text Configuration Section -->
        <!-- class="space-y-3" -->
        <div class="space-y-6">
          <div class="text-[18px] font-semibold text-[#09090B]">Speech-To-Text (STT) Setup</div>
          <div class='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 w-full'>
            <SelectField name="stt.provider" :options="sttProviders" label="Provider" placeholder="Select provider">
            </SelectField>
            <SelectField v-if="values.stt?.provider === 'google'" name="stt.adaptation" :options="adaptations"
              label="Adaptation" placeholder="Select adaptation">
            </SelectField>
            <SelectField v-if="values.stt?.provider === 'google'" name="stt.googlemodel" :options="models" label="Model"
              placeholder="Select Model">
            </SelectField>
            <SelectField v-if="values.stt?.provider === 'deepgram'" name="stt.model" :options="models" label="Model">
            </SelectField>

            <div :class="['flex flex-col gap-2', (values.stt?.provider === 'deepgram') ? 'my-5' : 'mt-5']">
              <RangeSlider :step="0.05" :name="parseFloat(values.stt?.amplificationFactor)" label="Amplification Factor"
                @update="changeTempture($event)" placeholder="Enter speaking Rate" min="0" max="4" />
            </div>

            <TextField v-if="values.stt?.provider === 'deepgram'" label="Utterance End Ms" name="stt.utteranceEndMs"
              placeholder="Utterance End Ms" disableCharacters />
            <TextField v-if="values.stt?.provider === 'google'" label="Recognizer" name="stt.recognizer"
              placeholder="Enter Recognizer" />
            <TextField type="number" v-if="values.stt?.provider === 'deepgram'" label="End pointing"
              name="stt.endpointing" placeholder="Enter endpointing" disableCharacters />
            <TextField type="number" v-if="values.stt?.provider === 'assemblyai'" label="End pointing"
              name="stt.endutterancesilencethreshold" placeholder="Enter endpointing" disableCharacters />
          </div>
          <!-- Field Arrays for STT -->
          <div class="mb-2">
            <FieldArray v-if="values.stt?.provider === 'deepgram'" name="stt.keywords"
              v-slot="{ fields, push, remove }">
              <fieldset v-for="(field, idx) in fields" :key="field.key">
                <div class='flex items-end gap-2 mt-2'>
                  <TextField :label="`keyword ${idx + 1}`" :id="`value_${idx}`" :name="`stt.keywords[${idx}].value`"
                    placeholder="Enter keyword" />
                  <TextField :label="`boost value ${idx + 1}`" :id="`value_${idx}`"
                    :name="`stt.keywords[${idx}].boostValue`" placeholder="Enter Boost value" disableCharacters />
                  <div
                    :class="['flex', (field.value?.value && (field.value?.boostValue)) ? 'items-end' : (errors[`stt.keywords[${idx}].value`]) ? 'items-center' : 'items-end']">
                    <UiButton variant="outline" type="button" @click="remove(idx)">
                      <CloseIcon class="w-4 h-4" />
                    </UiButton> 
                  </div>
                </div>
              </fieldset>
              <div class='flex justify-end w-full'>
                <UiButton class='mt-2' variant="outline" type="button" @click="push({ value: '', boostValue: '' })">
                  Add keyword
                </UiButton>
              </div>
            </FieldArray>

            <FieldArray v-if="values.stt?.provider === 'assemblyai'" name="stt.wordboost"
              v-slot="{ fields, push, remove }">
              <fieldset v-for="(field, idx) in fields" :key="field.key">
                <div class="flex gap-2 mt-2">
                  <TextField :label="`keyword ${idx + 1}`" :id="`value_${idx}`" :name="`stt.wordboost[${idx}].value`"
                    placeholder="Enter keyword" />
                  <TextField :label="`boost value ${idx + 1}`" :id="`value_${idx}`"
                    :name="`stt.wordboost[${idx}].boostValue`" placeholder="Enter Boost value" disableCharacters />
                  <div
                    :class="['flex', (field.value?.value && (field.value?.boostValue)) ? 'items-end' : (errors[`stt.wordboost[${idx}].boostValue`]) ? 'items-center' : 'items-end']">
                    <UiButton variant="outline" type="button" @click="remove(idx)">
                      <CloseIcon class="w-4 h-4" />
                    </UiButton>
                  </div>
                </div>
              </fieldset>
              <div class='flex justify-end w-full'>
                <UiButton class='mt-2' variant="outline" type="button" @click="push({ value: '', boostValue: '' })">
                  Add keyword
                </UiButton>
              </div>
            </FieldArray>

            <FieldArray v-if="values.stt?.provider === 'google'" name="stt.phraseSets"
              v-slot="{ fields, push, remove }">
              <fieldset v-for="(field, idx) in fields" :key="field.key">
                <div class='flex items-end gap-2 mt-2'>
                  <TextField :label="`phrase set ${idx + 1}`" :id="`value_${idx}`"
                    :name="`stt.phraseSets[${idx}].value`" placeholder="Enter phrase" />
                  <UiButton v-if="(values.stt?.provider === 'google') || (values.stt?.provider !== 'azure')"
                    variant="outline" type="button" @click="remove(idx)" :disabled="idx === 0">
                    <CloseIcon class="w-4 h-4" />
                  </UiButton>
                </div>
              </fieldset>
              <div class='flex justify-end w-full'>
                <UiButton class='mt-2' variant="outline" type="button" @click="push({ value: '' })">
                  Add phrase set
                </UiButton>
              </div>
            </FieldArray>

            <FieldArray v-if="values.stt?.provider === 'azure'" name="stt.phraseLists"
              v-slot="{ fields, push, remove }">
              <fieldset v-for="(field, idx) in fields" :key="field.key">
                <div class='flex gap-2 mt-2'>
                  <TextField :label="`phrase list ${idx + 1}`" :id="`value_${idx}`"
                    :name="`stt.phraseLists[${idx}].value`" placeholder="Enter phrase" />
                  <div
                    :class="['flex', (field.value?.value) ? 'items-end' : (errors[`stt.phraseLists[${idx}].value`]) ? 'items-center mt-2' : 'items-end']">
                    <UiButton v-if="(values.stt?.provider === 'azure')" variant="outline" type="button"
                      @click="remove(idx)" :disabled="idx === 0">
                      <CloseIcon class="w-4 h-4" />
                    </UiButton>
                  </div>
                </div>
              </fieldset>
              <div class='flex justify-end w-full'>
                <UiButton class='mt-2' variant="outline" type="button" @click="push({ value: '' })">
                  Add phrase list
                </UiButton>
              </div>
            </FieldArray>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2">
          <UiButton type="submit" class="px-9">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</Template>
<script setup lang="ts">
import { useForm, FieldArray } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import CloseIcon from "~/components/icons/CloseIcon.vue";
import { useBreadcrumbStore } from "~/store/breadcrumbs";
import { useIntegrations } from '@/composables/botManagement/voiceBot/useTtsIntegrations';
import { useElevenLabsVoices } from '@/composables/botManagement/voiceBot/useElevenLabsTTSIntegration';
import { useElevenLabsModels } from '@/composables/botManagement/voiceBot/useElevenLabsModelsComposable';
import { combinedValidationSchema } from "~/validationSchema/botManagement/voiceBot/EditVoiceBotValidation";

const route = useRoute("voice-bot-id");
const breadcrumbStore = useBreadcrumbStore();
const isLoading = ref(false);
const isPageLoading = ref(true);
const activeTab = ref('tts'); // Default to TTS tab

// Get bot details
const botDetails = ref(await getVoiceBotDetails(route.params.id));

// Set breadcrumbs
breadcrumbStore.setBreadcrumbs([
  {
    label: 'Voice Bot Configuration',
    to: `/voice-bot/${botDetails.value?.id}`,
  },
  {
    label: `${botDetails.value?.name}`,
    to: `/voice-bot/${botDetails.value?.id}/config`,
  },
]);

// TTS related data
const { integrationsData, status } = useIntegrations({});
const formattedElevenlabsVoiceList = ref([]);
const formattedElevenlabsModelList = ref([]);
const currentApiKey = ref(null);

const ttsProviders = ref([
  { label: "tring", value: "tring" },
  { label: "google", value: "google" },
  { label: "deepgram", value: "deepgram" }
]);
const useSpeakerBooster = [
  { label: "Yes", value: true },
  { label: "No", value: false }
];
const voices = [
  { label: "Asteria English(US)", value: "aura-asteria-en" },
  { label: "Luna English(US)", value: "aura-luna-en" },
  { label: "Stella English (US)", value: "aura-stella-en" },
  { label: "Athena English (UK)", value: "aura-athena-en" },
  { label: "Orion English (US)", value: "aura-orion-en" },
  { label: "Arcas English (US)", value: "aura-arcas-en" },
  { label: "Perseus English (US)", value: "aura-perseus-en" },
  { label: "Angus English (Ireland)", value: "aura-angus-en" },
  { label: "Orpheus English (US)", value: "aura-orpheus-en" },
  { label: "Helios English (UK)", value: "aura-helios-en" },
  { label: "Zeus English (US)", value: "aura-zeus-en" }
];

// STT related data
const sttProviders = ref([
  { label: "Google", value: "google" },
  { label: "Azure", value: "azure" },
  { label: "Deepgram", value: "deepgram" },
  { label: "Assembly AI", value: "assemblyai" }
]);
const adaptations = [
  { label: "Yes", value: true },
  { label: "No", value: false }
];
const models = ref([
  { label: "Long", value: "long" },
  { label: "Short", value: "short" }
]);

// LLM related data
const tokens = ["8192", "1024", "2048", "4096"];

// Setup form with combined validation schema
const { 
  handleSubmit, 
  setFieldValue, 
  values, 
  errors, 
  resetForm 
} = useForm({
  validationSchema: toTypedSchema(combinedValidationSchema),
  initialValues: {
    tts: {},
    stt: {},
    llm: {}
  }
});

// Fetch existing configuration data
const { data: botData, status: botLoadingStatus } = await useLazyFetch<{
  textToSpeechConfig: Record<string, any>;
  speechToTextConfig: Record<string, any>;
  llmConfig: Record<string, any>;
}>(`/api/voicebots/${route.params.id}`);

// Handle ElevenLabs integration for TTS
watch([() => values.tts?.provider, integrationsData], ([newProvider, newIntegrationsData]) => {
  if (newProvider && Array.isArray(newIntegrationsData)) {
    const selectedIntegration = newIntegrationsData.find(
      integration => integration.ttsIntegrationName === newProvider || 
                      integration.provider === newProvider
    );
    
    if (selectedIntegration?.metadata?.apiKey) {
      const apiKey = selectedIntegration.metadata?.apiKey;
      
      // Only reinitialize if the API key changed
      if (currentApiKey.value !== apiKey) {
        currentApiKey.value = apiKey;
        
        // Initialize ElevenLabs voices and models
        const { elevenlabsVoiceList, refreshVoices } = useElevenLabsVoices(apiKey);
        const { elevenlabsModelList, refreshModels } = useElevenLabsModels(apiKey);
        
        // Watch for voices data changes
        watch(() => elevenlabsVoiceList.value, (newVoiceList) => {
          if (newVoiceList) {
            formattedElevenlabsVoiceList.value = newVoiceList?.map((voice) => ({
              label: voice.name,
              value: voice.voice_id,
            }));
          }
        }, { immediate: true });
        
        // Watch for models data changes
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
            }
          }
        }, { immediate: true });
      }
    } else {
      formattedElevenlabsVoiceList.value = [];
      formattedElevenlabsModelList.value = [];
    }
  }
}, { deep: true, immediate: true });

// Watch for provider changes in STT to update available models
watch(() => values.stt?.provider, (newProvider) => {
  if (newProvider === "deepgram") {
    models.value = [
      { label: "Nova-2", value: "nova-2" },
      { label: "Nova", value: "nova" },
      { label: "Enhanced", value: "enhanced" },
      { label: "Base", value: "base" }
    ];
  } else if (newProvider === "google") {
    models.value = [
      { label: "Long", value: "long" },
      { label: "Short", value: "short" }
    ];
  } else {
    models.value = [];
  }
});

// Load initial data when bot data is available
watch(botData, () => {
  if (botData.value) {
    // Load TTS configuration
    if (botData.value.textToSpeechConfig) {
      setFieldValue("tts.provider", botData.value.textToSpeechConfig.provider);
      
      // Google specific settings
      if (botData.value.textToSpeechConfig.google) {
        setFieldValue("tts.pitch", botData.value.textToSpeechConfig.google.pitch);
        setFieldValue("tts.name", botData.value.textToSpeechConfig.google.name);
        setFieldValue("tts.speakingRate", botData.value.textToSpeechConfig.google.speaking_rate);
        setFieldValue("tts.volumeGainDb", botData.value.textToSpeechConfig.google.volume_gain_db);
      }
      
      // ElevenLabs specific settings
      if (botData.value.textToSpeechConfig.elevenlabs) {
        setFieldValue("tts.elevenlabsvoice", botData.value.textToSpeechConfig.elevenlabs.voice);
        setFieldValue("tts.model", botData.value.textToSpeechConfig.elevenlabs.model);
        setFieldValue("tts.stability", botData.value.textToSpeechConfig.elevenlabs.stability);
        setFieldValue("tts.similarityBoost", botData.value.textToSpeechConfig.elevenlabs.similarity_boost);
        setFieldValue("tts.style", botData.value.textToSpeechConfig.elevenlabs.style);
        setFieldValue("tts.useSpeakerBoost", botData.value.textToSpeechConfig.elevenlabs.use_speaker_boost);
      }
      
      // Deepgram specific settings
      if (botData.value.textToSpeechConfig.deepgram) {
        setFieldValue("tts.voice", botData.value.textToSpeechConfig.deepgram.voice);
      }
      
      // Tring specific settings
      if (botData.value.textToSpeechConfig.tring) {
        setFieldValue("tts.speaker", botData.value.textToSpeechConfig.tring.speaker);
        setFieldValue("tts.speakingSpeed", botData.value.textToSpeechConfig.tring.speed);
        setFieldValue("tts.silence_pad", botData.value.textToSpeechConfig.tring.silence_pad || 250);
        if (botData.value.textToSpeechConfig.provider === 'tring') {
          setFieldValue("tts.apikey", botData.value.textToSpeechConfig.tring.api_key || '');
        }
      }
    }
    
    // Load STT configuration
    if (botData.value.speechToTextConfig) {
      setFieldValue("stt.provider", botData.value.speechToTextConfig.provider);
      
      // Provider-specific settings
      if (botData.value.speechToTextConfig.azure) {
        const phraseList = botData.value.speechToTextConfig.azure.phrase_list || [];
        setFieldValue("stt.phraseLists", phraseList.map((item) => ({ value: item })));
        setFieldValue("stt.amplificationFactor", botData.value.speechToTextConfig.azure.amplification_factor);
      }
      
      if (botData.value.speechToTextConfig.google) {
        const phraseSetList = botData.value.speechToTextConfig.google.phrase_sets || [];
        setFieldValue("stt.phraseSets", phraseSetList.map((item) => ({ value: item })));
        setFieldValue("stt.adaptation", botData.value.speechToTextConfig.google.adaptation);
        setFieldValue("stt.recognizer", botData.value.speechToTextConfig.google.recognizer || '');
        setFieldValue("stt.googlemodel", botData.value.speechToTextConfig.google.model);
      }
      
      if (botData.value.speechToTextConfig.deepgram) {
        setFieldValue("stt.model", botData.value.speechToTextConfig.deepgram.model);
        setFieldValue("stt.endpointing", botData.value.speechToTextConfig.deepgram.endpointing);
        setFieldValue("stt.utteranceEndMs", botData.value.speechToTextConfig.deepgram.utterance_end_ms);
        setFieldValue("stt.amplificationFactor", botData.value.speechToTextConfig.deepgram.amplification_factor);
        
        const keywords = botData.value.speechToTextConfig.deepgram.keywords || [];
        const formattedKeywords = keywords.map(keyword => {
          const [value, boostValue] = keyword.split(":");
          return { value, boostValue };
        });
        setFieldValue("stt.keywords", formattedKeywords.length ? formattedKeywords : []);
      }
      
      if (botData.value.speechToTextConfig.assemblyai) {
        setFieldValue("stt.endutterancesilencethreshold", botData.value.speechToTextConfig.assemblyai.end_utterance_silence_threshold);
        
        const wordBoostList = botData.value.speechToTextConfig.assemblyai.word_boost || [];
        const formattedWordBoost = wordBoostList.map(keyword => {
          const [value, boostValue] = keyword.split(":");
          return { value, boostValue };
        });
        setFieldValue("stt.wordboost", formattedWordBoost);
      }
    }
    
    // Load LLM configuration
    if (botData.value.llmConfig) {
      Object.entries(botData.value.llmConfig).forEach(([key, value]) => {
        setFieldValue(`llm.${key}`, value);
      });
    }
    
    isPageLoading.value = false;
  }
}, { deep: true, immediate: true });


const changeTempture = (temValue: any) => {
  console.log(temValue, 'temValue --- temValue');
  setFieldValue('stt.amplificationFactor', temValue);
}
// Form submission handler
const handleIntegratedSubmit = handleSubmit(async (formValues) => {
  isLoading.value = true;
  
  try {
    // Format TTS config
    const ttsConfig = formatTtsConfig(formValues.tts);
    
    // Format STT config
    const sttConfig = formatSttConfig(formValues.stt);
    
    // LLM config (use directly)
    const llmConfig = formValues.llm;
    
    // Send all configurations in a single API call
    await $fetch(`/api/voicebots/${route.params.id}`, {
      method: "PUT",
      body: {
        textToSpeechConfig: ttsConfig,
        speechToTextConfig: sttConfig,
        llmConfig: llmConfig
      }
    });
    
    toast.success("All configurations updated successfully");
    
    // Navigate back to voice bot details page
    navigateTo({
      name: "voice-bot-id",
      params: { id: route.params.id }
    });
  } catch (error) {
    toast.error("Error updating configurations");
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
});

// Helper function for API key unmasking
const apikeyunmasking = ($event) => {
  const input = $event.target;
  const newInput = input.value.replace(/\*/g, '');
};

// Helper function to format TTS config
function formatTtsConfig(ttsValues) {
  const config = {
    provider: ttsValues.provider || 'google'
  };
  
  if (ttsValues.provider === 'google') {
    config.google = {
      name: ttsValues.name || "en-IN-Neural2-A",
      speaking_rate: ttsValues.speakingRate || 1,
      pitch: ttsValues.pitch || 1,
      volume_gain_db: ttsValues.volumeGainDb || 0.5
    };
  } else if (ttsValues.provider === 'tring') {
    config.tring = {
      speed: ttsValues.speakingSpeed || 1,
      speaker: ttsValues.speaker || "",
      silence_pad: ttsValues.silence_pad || 250,
      api_key: ttsValues.apikey || "",
      sample_rate: ttsValues.sampleRate || 22050
    };
  } else if (ttsValues.provider === 'deepgram') {
    config.deepgram = {
      voice: ttsValues.voice || "aura-asteria-en"
    };
  } else if (ttsValues.provider !== 'tring' && ttsValues.provider !== 'google' && ttsValues.provider !== 'deepgram') {
    // Handle ElevenLabs or other providers
    const elevenlabsConfig = {
      voice: ttsValues.elevenlabsvoice || "",
      model: ttsValues.model || "eleven_turbo_v2",
      stability: ttsValues.stability || 0.5,
      similarity_boost: ttsValues.similarityBoost || 1
    };
    
    if (ttsValues.model === 'eleven_multilingual_v2') {
      elevenlabsConfig.style = ttsValues.style || 0.5;
      elevenlabsConfig.use_speaker_boost = ttsValues.useSpeakerBoost || false;
    }
    
    if (ttsValues.apikey) {
      elevenlabsConfig.api_key = ttsValues.apikey;
    }
    
    config.elevenlabs = elevenlabsConfig;
  }
  
  return config;
}

// Helper function to format STT config
function formatSttConfig(sttValues) {
  const config = {
    provider: sttValues.provider || 'deepgram'
  };
  
  if (sttValues.provider === "google") {
    config.google = {
      model: sttValues.googlemodel || 'short',
      adaptation: sttValues.adaptation || true,
      phrase_sets: sttValues.phraseSets?.map(item => item.value) || [],
      amplification_factor: sttValues.amplificationFactor || 2,
      recognizer: sttValues.recognizer || ''
    };
  } else if (sttValues.provider === "azure") {
    config.azure = {
      phrase_list: sttValues.phraseLists?.map(item => item.value) || [],
      amplification_factor: sttValues.amplificationFactor || 2
    };
  } else if (sttValues.provider === "deepgram") {
    config.deepgram = {
      model: sttValues.model || 'nova-2',
      keywords: sttValues.keywords?.map(keywordObj => `${keywordObj.value}:${keywordObj.boostValue}`) || [],
      endpointing: sttValues.endpointing || 300,
      utterance_end_ms: String(sttValues.utteranceEndMs) || '1000',
      amplification_factor: sttValues.amplificationFactor || 2
    };
  } else if (sttValues.provider === "assemblyai") {
    config.assemblyai = {
      word_boost: sttValues.wordboost?.map(keywordObj => `${keywordObj.value}:${keywordObj.boostValue}`) || [],
      end_utterance_silence_threshold: sttValues.endutterancesilencethreshold || 300,
      amplification_factor: sttValues.amplificationFactor || 2
    };
  }
  
  return config;
}

// Update page title based on bot name
watchEffect(() => {
  if (botDetails.value) {
    const userName = botDetails.value?.name ?? "Unknown Bot Name";
    useHead({
      title: `Voice Bot | ${userName} - Configuration`,
    });
  }
});

// Watch for ElevenLabs integration data 
watch([status, integrationsData], ([newStatus, newData]) => {
  if (newStatus === 'success' && Array.isArray(newData)) {
    try {
      const elevenLabsIntegrations = newData.filter(
        integration => integration.provider === 'elevenlabs'
      );
      
      if (elevenLabsIntegrations.length > 0) {
        const updatedProviders = [...ttsProviders.value];
        
        elevenLabsIntegrations.forEach(integration => {
          updatedProviders.push({
            label: integration?.ttsIntegrationName || 'ElevenLabs',
            value: integration?.ttsIntegrationName || 'elevenlabs',
          });
        });
        
        ttsProviders.value = updatedProviders;
      }
    } catch (error) {
      console.error("Error processing integration data:", error);
    }
  }
}, { immediate: true });

watch(errors, (newErrors) => {
  console.log("Errors:", newErrors);
})
</script>

