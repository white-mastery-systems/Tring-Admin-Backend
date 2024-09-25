<template>
  <Page title="Text To Speech Configurations">
    <form @submit="onSubmit">
      <div class="flex flex-col gap-2">
        <SelectField
          name="provider"
          label="provider"
          placeholder="Select provider"
          helperText="Select your provider."
          :options="providers"
          required
        />
        <SelectField
          v-if="values.provider === 'google'"
          name="language"
          label="Language"
          placeholder="Select language"
          helperText="Select your language."
          :options="languages"
          required
        />
        <SelectField
          name="voiceType"
          label="Voice Type"
          placeholder="Select Voice Type"
          helperText="Select your voiceType."
          :options="voiceTypes"
          required
        />
        <RangeSlider
          v-if="values.provider === 'google'"
          :step="0.1"
          :name="parseFloat(values.speakingRate)"
          label="Speaking Rate"
          @update="
            ($event) => {
              setFieldValue('speakingRate', $event.toString());
            }
          "
          required
          placeholder="Enter speaking Rate"
          min="0"
          max="1"
        />
        <!-- <TextField v-if="values.provider === 'google'" label="Speaking Rate" name="speakingRate" required placeholder="Enter speaking Rate" -->
        <!-- disableCharacters /> -->

        <RangeSlider
          v-if="values.provider === 'google'"
          :step="0.1"
          :name="parseFloat(values.pitch)"
          label="Enter pitch"
          @update="
            ($event) => {
              setFieldValue('pitch', $event.toString());
            }
          "
          required
          placeholder="Enter speaking Rate"
          min="0"
          max="1"
        />
        <RangeSlider
          v-if="values.provider === 'google'"
          :step="0.1"
          :name="parseFloat(values.volumeGrainDb )"
          label="volume Grain DB"
          @update="
            ($event) => {
              setFieldValue('volumeGrainDb', $event.toString());
            }
          "
          required
          placeholder="Enter speaking Rate"
          min="0"
          max="1"
        />
        <!-- <TextField
          v-if="values.provider === 'google'"
          label="volume Grain DB"
          name="volumeGrainDb"
          required
          placeholder="Enter volume Grain DB"
          disableCharacters
        /> -->

          <RangeSlider
          v-if="values.provider === 'elevenlabs'"
          :step="0.1"
          :name="parseFloat(values.stability )"
          label="Stability"
          @update="
            ($event) => {
              setFieldValue('stability', $event.toString());
            }
          "
          required
          placeholder="Enter speaking Rate"
          min="0"
          max="1"
        />

          <RangeSlider
          v-if="values.provider === 'elevenlabs'"
          :step="0.1"
          :name="parseFloat(values.similarityBoost )"
          label="Similarity boost"
          @update="
            ($event) => {
              setFieldValue('similarityBoost', $event.toString());
            }
          "
          required
          placeholder="Enter speaking Rate"
          min="0"
          max="1"
        />
          <RangeSlider
          v-if="values.provider === 'elevenlabs'"
          :step="0.1"
          :name="parseFloat(values.style )"
          label="Style"
          @update="
            ($event) => {
              setFieldValue('style', $event.toString());
            }
          "
          required
          placeholder="Enter speaking Rate"
          min="0"
          max="1"
        />
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
        <TextField
          v-if="values.provider === 'elevenlabs'"
          label="Use Speaker Boost"
          name="useSpeakerBoost"
          required
          placeholder="Use Speaker Boost"
          disableCharacters
        />
        <SelectField
          v-if="values.provider === 'deepgram'"
          name="voice"
          label="voice"
          placeholder="Select voice"
          helperText="Select your voice."
          :options="voices"
          required
        />
        <UiButton color="primary" type="submit">Submit</UiButton>
      </div>
    </form>
  </Page>
</template>

<script setup>
  import { getValue } from "@unovis/ts";
  import { useForm } from "vee-validate";
  import { textToSpeechValidation } from "~/validationSchema/textToSpeechValidation";

  const { handleSubmit, setFieldValue, values, resetForm ,errors} = useForm({
    initialValues: {
      multiple: [],
    },
    validationSchema: toTypedSchema(textToSpeechValidation),
  });

  watch(errors, (newValues) => {
    console.log(newValues,values)
    if (newValues) {
      console.log("ERRORS", newValues)
    }
  })
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
  const languages = [
    {
      label: "En-US",
      value: "en-US",
    },
    {
      label: "En-IN",
      value: "en-IN",
    },
    {
      label: "Hindi",
      value: "hi-IN",
    },
    {
      label: "Tamil",
      value: "ta-IN",
    },
  ];
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
  const route = useRoute("bot-management-voice-bot-id-text-to-speech-config");

  const botData = await $fetch(`/api/voicebots/` + route.params.id);

  if (botData && botData.textToSpeechConfig) {
    // setFieldValue("language", botData.textToSpeechConfig.language);
    setFieldValue("provider", botData.textToSpeechConfig.provider);

    if (botData.textToSpeechConfig.pitch) {
      setFieldValue("pitch", botData.textToSpeechConfig.pitch);
    }
    if (botData.textToSpeechConfig.voiceType) {
      setFieldValue("voiceType", botData.textToSpeechConfig.voiceType);
    }
    if (botData.textToSpeechConfig.speakingRate) {
      setFieldValue("speakingRate", botData.textToSpeechConfig.speakingRate);
    }
    if (botData.textToSpeechConfig.volumeGrainDb) {
      setFieldValue("volumeGrainDb", botData.textToSpeechConfig.volumeGrainDb);
    }
    if (botData.textToSpeechConfig.stability) {
      setFieldValue("stability", botData.textToSpeechConfig.stability);
    }
    if (botData.textToSpeechConfig.similarityBoost) {
      setFieldValue(
        "similarityBoost",
        botData.textToSpeechConfig.similarityBoost,
      );
    }
    if (botData.textToSpeechConfig.style) {
      setFieldValue("style", botData.textToSpeechConfig.style);
    }
    if (botData.textToSpeechConfig.useSpeakerBoost) {
      setFieldValue(
        "useSpeakerBoost",
        botData.textToSpeechConfig.useSpeakerBoost,
      );
    }
    if (botData.textToSpeechConfig.voice) {
      setFieldValue("voice", botData.textToSpeechConfig.voice);
    }
    console.log(values);
  }

  const onSubmit = handleSubmit(async (values) => {
    // setFieldValue("passwordConfirm", values.password);
    // setFieldValue("firstName", 'appu');
    // setFieldValue("crm", "zoho-crm");
    console.log(values);

    await $fetch(`/api/voicebots/${route.params.id}`, {
      method: "PUT",
      body: {
        textToSpeechConfig: { ...values },
      },
    });
  });
</script>
