<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useField } from 'vee-validate';
// import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, any>;
  disabled: Record<boolean, any>;
  intentOptions: Record<string, any>;
}>();

const emit = defineEmits(["update:values"]);
const { value: temperature } = useField("temperature")
const { value: provider_stt } = useField("provider_stt")
const { value: provider_tts } = useField("provider_tts")
const { value: max_output_token } = useField("max_output_token")
const { value: googlemodel } = useField("googlemodel")
const { value: model } = useField("model")
const { value: elevenlabsvoice } = useField("elevenlabsvoice")
const { value: voice } = useField("voice")
const { value: name } = useField("name")
const { value: apikey } = useField("apikey")
const { value: model_stt } = useField("model_stt")
const { value: apikey_stt } = useField("apikey_stt")
const { value: model_tts } = useField("model_tts")
const { value: apikey_tts } = useField("apikey_tts")
const { value: otherRole, errorMessage: otherRoleError } = useField("otherRole");
const { value: otherGoal, errorMessage: otherGoalError } = useField("otherGoal");
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
const providersTSS = [
  {
    label: "tring",
    value: "tring",
  },
  {
    label: "google",
    value: "google",
  },
  {
    label: "elevenlabs",
    value: "elevenlabs",
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
const modalList = [
  {
    value: "eleven_multilingual_v2",
    label: "Eleven Multilingual v2"
  },
  {
    value: "eleven_turbo_v2_5",
    label: "Eleven Turbo v2.5"
  },
  {
    value: "eleven_turbo_v2",
    label: "Eleven Turbo v2"
  },
  {
    value: "eleven_multilingual_sts_v2",
    label: "Eleven Multilingual v2"
  },
  {
    value: "eleven_flash_v2",
    label: "Eleven Flash v2"
  },
  {
    value: "eleven_multilingual_v1",
    label: "Eleven Multilingual v1"
  },
  {
    value: "eleven_flash_v2_5",
    label: "Eleven Flash v2.5"
  },
  {
    value: "eleven_monolingual_v1",
    label: "Eleven English v1"
  }
];

// Watch for all form field changes
watch([
  temperature, 
  provider_stt, 
  provider_tts, 
  max_output_token, 
  googlemodel, 
  model, 
  elevenlabsvoice, 
  voice, 
  name, 
  apikey, 
  model_stt,
  apikey_stt,
  model_tts,
  apikey_tts
], () => {
  emit("update:values", {
    ...props.values,
    provider_stt: provider_stt.value,
    provider_tts: provider_tts.value,
    max_output_token: max_output_token.value,
    temperature: temperature.value,
    googlemodel: googlemodel.value,
    model: model.value,
    elevenlabsvoice: elevenlabsvoice.value,
    voice: voice.value,
    name: name.value,
    apikey: apikey.value,
    model_stt: model_stt.value,
    apikey_stt: apikey_stt.value,
    model_tts: model_tts.value,
    apikey_tts: apikey_tts.value,
    // ROLE: newValue,
    // otherRole: otherRole.value,
    // otherGoal: otherGoal.value
  });
});

// Watch for otherRole and otherGoal change

// watch(() => props.values.type, (newType) => {
//   props.fetchConfig(newType);
// }, { deep: true, immediate: true });
</script>
<template>
   <BotSetupCard 
      title="Bot Details" 
      description="Configure your bot's basic information" 
      currentStep="5" 
      totalSteps="6">
      <div>
        <span class="font-bold">Speech-To-Text (STT) Setup</span>
        <div class="grid grid-cols-2 gap-4">
          <SelectField v-model="provider_stt" name="provider_stt" :options="providers" label="Provider" placeholder="Select provider"></SelectField>
          <SelectField v-model="model_stt" v-if="provider_stt === 'deepgram'" name="model_stt" :options="models" label="Model"
          placeholder="Select Model"></SelectField>
          <SelectField v-if="provider_stt === 'google'" v-model="googlemodel" name="googlemodel" :options="models" label="Model"
            placeholder="Select Model"></SelectField>
          <TextField v-if="provider_stt" v-model="apikey_stt" type="text" label="API Key" name="apikey_stt" placeholder="API Key" />
        </div>
        </div>
        <div>
          <span class="font-bold">Text-To-Speech (TTS) Setup</span>
          <div class="flex items-center grid grid-cols-2 gap-4">
            <SelectField v-model="provider_tts" name="provider_tts" label="Provider" placeholder="Select provider"
               :options="providersTSS" />
               <SelectField v-if="provider_tts === 'elevenlabs'" v-model="model" name="model" label="Model" placeholder="Model"
               :options="modalList" />
               <TextField v-if="(provider_tts === 'elevenlabs')" v-model="apikey" type="text"
               label="API Key" name="apikey" placeholder="API Key" @input="apikeyunmasking($event)" />
               <TextField v-if="provider_tts === 'elevenlabs'" v-model="elevenlabsvoice" type="text" label="voice" name="elevenlabsvoice"
               placeholder="voice" />
               <SelectField v-if="provider_tts === 'deepgram'" v-model="voice" name="voice" label="Voice" placeholder="Select voice" :options="voices" />
               <TextField v-if="provider_tts && provider_tts !== 'elevenlabs'" v-model="apikey_tts" type="text" label="API Key" name="apikey_tts" placeholder="API Key" />
               <SelectField v-if="provider_tts && provider_tts !== 'elevenlabs'" v-model="model_tts" name="model_tts" :options="models" label="Model" placeholder="Select Model" />
               <div class="flex flex-col gap-4 pt-1">
                 <TextField class="mt-4" v-if="provider_tts === 'google'" v-model="name" type="text" label="Name" name="name"
                 placeholder="Name" />
               </div>
          </div>
        </div>
        <div>
        <span class="font-bold">Large Language Model (LLM) Setup</span>
        <div class="grid grid-cols-2 gap-4">
        <SelectField v-model="max_output_token" name="max_output_token" label="Max Tokens" placeholder="Max Tokens"
        :options="tokens.map((token) => ({ label: token, value: token }))" :required="true" />
        <div class="mt-5 flex flex-col gap-2">
          <RangeSlider :step="0.05" :name="temperature" label="Temperature" @update="($event) => { temperature = $event; }"  required placeholder="Enter speaking Rate" min="0" max="2" />
        </div>
          </div>
        </div>
    </BotSetupCard>
</template>