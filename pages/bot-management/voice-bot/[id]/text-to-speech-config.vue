<template>
  <Page title="Text To Speech Configurations">
    <div class="pb-2 sm:pb-0">
      <form @submit="onSubmit">
        <div class="flex flex-col gap-2">
          <SelectField name="provider" label="provider" placeholder="Select provider" helperText="Select your provider."
            :options="providers" required />
          <!-- <SelectField v-if="values.provider === 'google'" name="language" label="Language"
            placeholder="Select language" helperText="Select your language." :options="languageList" required /> -->
          <!-- <SelectField name="voiceType" label="Voice Type" placeholder="Select Voice Type"
            helperText="Select your voiceType." :options="voiceTypes" required /> -->
          <TextField v-if="values.provider === 'google'" type="text" label="Name" name="name" required
            placeholder="Name" />
          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
            <TextField v-if="values.provider === 'elevenlabs'" type="text" label="Model" name="model" required
              placeholder="Model" />
            <TextField v-if="values.provider === 'elevenlabs'" type="text" label="voice" name="elevenlabsvoice" required
              placeholder="voice" />
          </div>
          <RangeSlider v-if="values.provider === 'google'" :step="0.1" :name="parseFloat(values.speakingRate)"
            label="Speaking Rate" @update="
              ($event) => {
                setFieldValue('speakingRate', $event.toString());
              }
            " required placeholder="Enter speaking Rate" min="0" max="1" />
          <!-- <TextField v-if="values.provider === 'google'" label="Speaking Rate" name="speakingRate" required placeholder="Enter speaking Rate" -->
          <!-- disableCharacters /> -->

          <RangeSlider v-if="values.provider === 'google'" :step="0.1" :name="parseFloat(values.pitch)"
            label="Enter pitch" @update="
              ($event) => {
                setFieldValue('pitch', $event.toString());
              }
            " required placeholder="Enter speaking Rate" min="0" max="1" />
          <RangeSlider v-if="values.provider === 'google'" :step="0.1" :name="parseFloat(values.volumeGrainDb )"
            label="volume Grain DB" @update="
              ($event) => {
                setFieldValue('volumeGrainDb', $event.toString());
              }
            " required placeholder="Enter speaking Rate" min="0" max="1" />
          <!-- <TextField
            v-if="values.provider === 'google'"
            label="volume Grain DB"
            name="volumeGrainDb"
            required
            placeholder="Enter volume Grain DB"
            disableCharacters
          /> -->

          <RangeSlider v-if="values.provider === 'elevenlabs'" :step="0.1" :name="parseFloat(values.stability )"
            label="Stability" @update="
              ($event) => {
                setFieldValue('stability', $event.toString());
              }
            " required placeholder="Enter speaking Rate" min="0" max="1" />

          <RangeSlider v-if="values.provider === 'elevenlabs'" :step="0.1" :name="parseFloat(values.similarityBoost )"
            label="Similarity boost" @update="
              ($event) => {
                setFieldValue('similarityBoost', $event.toString());
              }
            " required placeholder="Enter speaking Rate" min="0" max="1" />
          <RangeSlider v-if="values.provider === 'elevenlabs'" :step="0.1" :name="parseFloat(values.style )"
            label="Style" @update="
              ($event) => {
                setFieldValue('style', $event.toString());
              }
            " required placeholder="Enter speaking Rate" min="0" max="1" />
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
          <SelectField v-if="values.provider === 'elevenlabs'" name="useSpeakerBoost" :options="useSpeakerBooster"
            label="Use Speaker Boost" placeholder="Use Speaker Boost">
          </SelectField>
          <SelectField v-if="values.provider === 'deepgram'" name="voice" label="Use Speaker Boost"
            placeholder="Select voice" helperText="Select your voice." :options="voices" required />
        </div>
        <div class="flex w-full justify-end mt-2">
          <UiButton color="primary" type="submit" :loading="isLoading">
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
  initialValues: {
    // multiple: [],
    // provider: 'google', // Default provider (change as needed)
    // language: '',
    // pitch: 1,            // Default values for Google
    // speakingRate: 1,
    // volumeGrainDb: 0,
    // stability: 0,       // Default for Elevenlabs
    // similarityBoost: 0,
    // style: 0,
    // useSpeakerBoost: 0,
    // voice: '',          // Default for Deepgram
  },
  validationSchema: toTypedSchema(textToSpeechValidation),
});
  // const botData = await $fetch(`/api/voicebots/` + route.params.id);
//  const { data: botData, status: botLoadingStatus } = await useLazyFetch<{
//    textToSpeechConfig: Record<string, string>;
//   }>(`/api/voicebots/${route.params.id}`);  


watch(botData, () => {
  // setFieldValue("language", botData.value.speechToTextConfig.language);
  setFieldValue("provider", botData.value.textToSpeechConfig.provider);
  
  setFieldValue("pitch", botData.value.textToSpeechConfig?.google.pitch);
  setFieldValue("name", botData.value.textToSpeechConfig?.google.name);
  setFieldValue("elevenlabsvoice", botData.value.textToSpeechConfig?.elevenlabs.voice);
  setFieldValue("model", botData.value.textToSpeechConfig?.elevenlabs.model);
  if (botData.value.textToSpeechConfig.voiceType) {
    setFieldValue("voiceType", botData.value.textToSpeechConfig.voiceType);
  }
  setFieldValue("speakingRate", botData.value.textToSpeechConfig?.google.speaking_rate);
  setFieldValue("volumeGrainDb", botData.value.textToSpeechConfig?.google.volume_gain_db);
    setFieldValue("stability", botData.value.textToSpeechConfig?.elevenlabs.stability);
    setFieldValue(
      "similarityBoost",
      botData.value.textToSpeechConfig?.elevenlabs.similarity_boost,
    );
    setFieldValue("style", botData.value.textToSpeechConfig?.elevenlabs.style);
    setFieldValue(
      "useSpeakerBoost",
      botData.value.textToSpeechConfig.elevenlabs.use_speaker_boost,
    );
    setFieldValue("voice", botData.value.textToSpeechConfig?.deepgram.voice);
}, { deep: true })
watch(errors, (newValues) => {
  console.log(newValues, values);
  if (newValues) {
    console.log("ERRORS", newValues);
  }
});

watch(
  () => toRaw(values.provider),
  (newValue) => {
    setFieldValue("pitch", botData.value.textToSpeechConfig?.google.pitch);
    setFieldValue("name", botData.value.textToSpeechConfig?.google.name);
    setFieldValue("elevenlabsvoice", botData.value.textToSpeechConfig?.elevenlabs.voice);
    setFieldValue("model", botData.value.textToSpeechConfig?.elevenlabs.model);
    // if (botData.value.textToSpeechConfig.voiceType) {
    //   setFieldValue("voiceType", botData.value.textToSpeechConfig.voiceType);
    // }
    setFieldValue("speakingRate", botData.value.textToSpeechConfig?.google.speaking_rate);
    setFieldValue("volumeGrainDb", botData.value.textToSpeechConfig?.google.volume_gain_db);
    setFieldValue("stability", botData.value.textToSpeechConfig?.elevenlabs.stability);
    setFieldValue(
      "similarityBoost",
      botData.value.textToSpeechConfig?.elevenlabs.similarity_boost,
    );
    setFieldValue("style", botData.value.textToSpeechConfig?.elevenlabs.style);
    setFieldValue(
      "useSpeakerBoost",
      botData.value.textToSpeechConfig.elevenlabs.use_speaker_boost,
    );
    setFieldValue("voice", botData.value.textToSpeechConfig?.deepgram.voice);
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
    provider: values.provider || botData.value.textToSpeechConfig.provider || 'google', // Default to 'google'

    // Google config
    google: {
      ...botData.value.textToSpeechConfig.google, // Keep existing Google config
      name: values.name !== undefined ? values.name : botData.value.textToSpeechConfig.google.name || "en-IN-Neural2-A",
      speaking_rate: values.speakingRate !== undefined ? values.speakingRate : botData.value.textToSpeechConfig.google.speaking_rate || 1,
      pitch: values.pitch !== undefined ? values.pitch : botData.value.textToSpeechConfig.google.pitch || 1,
      volume_gain_db: values.volumeGrainDb !== undefined ? values.volumeGrainDb : botData.value.textToSpeechConfig.google.volume_gain_db || 0.5,
      effects_profile_id: botData.value.textToSpeechConfig.google.effects_profile_id || ["telephony-class-application"], // Fallback to default
    },

    // ElevenLabs config
    elevenlabs: {
      ...botData.value.textToSpeechConfig.elevenlabs, // Keep existing Elevenlabs config
      api_key: botData.value.textToSpeechConfig.elevenlabs.api_key || "", // Consider secure handling of API keys
      voice: values.elevenlabsvoice !== undefined ? values.elevenlabsvoice : botData.value.textToSpeechConfig.elevenlabs.voice || "jBYIjE7vMSfVJhyXWNqw",
      model: values.model !== undefined ? values.model : botData.value.textToSpeechConfig.elevenlabs.model || "eleven_turbo_v2",
      stability: values.stability !== undefined ? values.stability : botData.value.textToSpeechConfig.elevenlabs.stability || 0.5,
      similarity_boost: values.similarityBoost !== undefined ? values.similarityBoost : botData.value.textToSpeechConfig.elevenlabs.similarity_boost || 1,
      style: values.style !== undefined ? values.style : botData.value.textToSpeechConfig.elevenlabs.style || 0.5,
      use_speaker_boost: values.useSpeakerBoost !== undefined ? values.useSpeakerBoost : botData.value.textToSpeechConfig.elevenlabs.use_speaker_boost || false,
    },

    // Deepgram config
    deepgram: {
      ...botData.value.textToSpeechConfig.deepgram, // Keep existing Deepgram config
      voice: values.deepgramVoice !== undefined ? values.deepgramVoice : botData.value.textToSpeechConfig.deepgram.voice || "aura-asteria-en",
      amplification_factor: values.amplificationFactor !== undefined ? values.amplificationFactor : botData.value.textToSpeechConfig.deepgram.amplification_factor || 2,
      // Add any other necessary Deepgram-specific fields similarly
    },
    // Add other providers as necessary
  };

  // Make the API call with the updated configuration
  await $fetch(`/api/voicebots/${route.params.id}`, {
    method: "PUT",
    body: {
      textToSpeechConfig: updatedConfig,
    },
  });

  toast.success("Updated successfully");
  isLoading.value = false;
});

</script>
