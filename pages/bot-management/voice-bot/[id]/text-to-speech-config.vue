<template>
  <Page title="Text To Speech Configurations" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/voice-bot/${botDetails.id}`,
    },
    {
      label: 'Text To Speech Configurations',
      to: `/bot-management/voice-bot/${botDetails.id}/text-to-speech-config`,
    },
  ]">
    <div class="pb-2 sm:pb-0">
      <form @submit.prevent="onSubmit" class="space-y-10">
        <div class="flex flex-col gap-2">
          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
            <SelectField name="provider" label="Provider" placeholder="Select provider"
              helperText="Select your provider." :options="providers" required />
            <!-- <SelectField v-if="values.provider === 'google'" name="language" label="Language"
            placeholder="Select language" helperText="Select your language." :options="languageList" required /> -->
            <!-- <SelectField name="voiceType" label="Voice Type" placeholder="Select Voice Type"
            helperText="Select your voiceType." :options="voiceTypes" required /> -->
            <TextField v-if="values.provider === 'google'" type="text" label="Name" name="name" required
              placeholder="Name" />
            <TextField v-if="(values.provider === 'tring') || (values.provider === 'elevenlabs')" type="text"
              label="API Key" name="apikey" required placeholder="API Key" @input="apikeyunmasking($event)" />
          </div>
            <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
              <TextField v-if="(values.provider === 'tring') || (values.provider === 'elevenlabs')" type="text"
                label="Language Speaker" name="speaker" required placeholder="Speaker" />
              <!-- <TextField v-if="values.provider === 'tring'" type="number" label="Sample Rate" name="sampleRate" required
              placeholder="Sample Rate" disableCharacters /> -->
              <!-- <TextField v-if="values.provider === 'elevenlabs'" type="text" label="Model" name="model" required
              placeholder="Model" /> -->
              <SelectField v-if="values.provider === 'elevenlabs'" name="model" label="Model" placeholder="Model"
                helperText="Select your model." :options="modalList" required />
              <TextField v-if="values.provider === 'elevenlabs'" type="text" label="voice" name="elevenlabsvoice"
                required placeholder="voice" />
              <SelectField v-if="values.provider === 'elevenlabs'" name="useSpeakerBoost" :options="useSpeakerBooster"
                label="Use Speaker Boost" placeholder="Use Speaker Boost" required>
              </SelectField>
            </div>
            <RangeSlider v-if="values.provider === 'google'" :step="0.05" :name="parseFloat(values.speakingRate)"
              label="Speaking Rate" @update="($event) => {
              setFieldValue('speakingRate', $event);
            }
              " required placeholder="Enter speaking speed" min="0" max="4" />
            <!-- <TextField type="rangeSlider" label="Speaking Speed" name="speakingSpeed" @input="($event) => {
              const numericValue = Number($event.target.value)
              setFieldValue('speakingSpeed', numericValue)
            }" required disableCharacters /> -->
            <!-- <div class="flex gap-2 grid grid-cols-2"> -->
            <RangeSlider v-if="values.provider === 'tring'" :step="0.05" :name="parseFloat(values.speakingSpeed)"
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

            <RangeSlider v-if="values.provider === 'elevenlabs'" :step="0.05" :name="parseFloat(values.stability)"
              label="Stability" @update="($event) => {
              setFieldValue('stability', $event);
            }
              " required min="0" max="1" />

            <RangeSlider v-if="values.provider === 'elevenlabs'" :step="0.05" :name="parseFloat(values.similarityBoost)"
              label="Similarity Boost" @update="($event) => {
              setFieldValue('similarityBoost', $event);
            }
              " required min="0" max="1" />
            <RangeSlider v-if="values.provider === 'elevenlabs'" :step="0.05" :name="parseFloat(values.style)"
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
import { useLanguageList } from '~/composables/useLanguageList';

const route = useRoute("bot-management-voice-bot-id-text-to-speech-config");


const { data: botData, status: botLoadingStatus } = await useLazyFetch<{
  textToSpeechConfig: Record<string, string>;
}>(`/api/voicebots/${route.params.id}`);
// const botData = await $fetch(`/api/voicebots/` + route.params.id);
// const { data: botData, status: botLoadingStatus } = await useLazyFetch <{ speechToTextConfig: Record < string, string>}> (`/api/voicebots/${route.params.id}`)


const isLoading = ref(false);

const providers = [
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
const modalList = [
  {
    label: "English v1",
    value: "eleven_monolingual_v1",
  }, {
    label: "Multilingual v1",
    value: "eleven_multilingual_v1",
  }, {
    label: "Multilingual v2",
    value: "eleven_multilingual_v2",
  }, {
    label: "Turbo v2",
    value: "eleven_turbo_v2",
  }, {
    label: "Turbo v2.5",
    value: "eleven_turbo_v2_5",
  },
]
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
const { languageList } = useLanguageList();
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
const botDetails = ref(await getVoiceBotDetails(route.params.id));

const { handleSubmit, setFieldValue, values, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(textToSpeechValidation),
  initialValues: {
  },
});

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
}, { deep: true })
watch(errors, (newValues) => {
  if (newValues) {
    console.log("ERRORS", newValues);
  }
});

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
              effects_profile_id: botData.value?.textToSpeechConfig.google.effects_profile_id || ["telephony-class-application"], // Fallback to default
      }
  }
  else if (values.provider === 'elevenlabs') {
    // ElevenLabs config
    updatedConfig.elevenlabs = {
      // ...botData.value?.textToSpeechConfig.elevenlabs, // Keep existing Elevenlabs config
      api_key: botData.value?.textToSpeechConfig.elevenlabs.api_key || "", // Consider secure handling of API keys
        voice: values.elevenlabsvoice || "jBYIjE7vMSfVJhyXWNqw",
          model: values.model || "eleven_turbo_v2",
            stability: values.stability || 0.5,
              similarity_boost: values.similarityBoost || 1,
                style: values.style || 0.5,
                  use_speaker_boost: values.useSpeakerBoost || false,
                    api_key: values.apikey || "",
   }

  }
  else if (values.provider === "deepgram") {
    // Deepgram config
    updatedConfig.deepgram = {
      // ...botData.value?.textToSpeechConfig.deepgram, // Keep existing Deepgram config
      voice: values.deepgramVoice || "aura-asteria-en",
       // amplification_factor: values.amplificationFactor !== undefined ? values.amplificationFactor : botData.value?.textToSpeechConfig.deepgram.amplification_factor || 2,
       // Add any other necessary Deepgram-specific fields similarly
     }
  }
  else if (values.provider === "tring") {
    updatedConfig.tring = {
      // ...botData.value?.textToSpeechConfig.deepgram, // Keep existing Deepgram config
      speed: values.speakingSpeed || 1,
      speaker: values.speaker || "jaya",
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
    name: "bot-management-voice-bot-id",
    params: { id: route.params.id },
  });
  isLoading.value = false;
});

const apikeyunmasking = ($event: event) => {
  console.log(apikey.value, "$event asdsad");
  // const unmasked = "*".repeat(originalLength - 4) + value.slice(-4);
}
</script>
