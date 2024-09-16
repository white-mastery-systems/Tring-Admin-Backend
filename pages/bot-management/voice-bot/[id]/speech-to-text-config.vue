<template>
  <Page title="Speech To Text Configurations">
    <form @submit="createEditSpeecToTextConfig">
      <SelectField name="language" :options="languages" label="Language" placeholder="Select Language"
        helperText="Select your language.">
      </SelectField>
      <SelectField name="provider" :options="providers" label="provider" placeholder="Select provider"
        helperText="Select your provider.">
      </SelectField>
      <SelectField name="adaptation" :options="adaptations" label="adaptation" placeholder="Select adaptation"
        helperText="Select your adaptation.">
      </SelectField>
      <SelectField name="model" :options="models" label="model" placeholder="Select model"
        helperText="Select your model.">
      </SelectField>
      <FieldArray name="phraseSets" v-slot="{ fields, push, remove }">
        <div v-for="(field, idx) in fields" :key="field.key">
          <TextField :helperText="`phraseset ${idx + 1}`" :name="`phraseSets[${idx}].name`" type="text" />
          <UiButton color="primary" type="button" @click="remove(idx)">Remove</UiButton>
        </div>
        <button type="button" @click="push({ id: Date.now(), name: '', name: '' })">Add</button>
      </FieldArray>

      <div class="flex w-full justify-end">
        <UiButton color="primary"> Submit </UiButton>
      </div>
    </form>
  </Page>
</template>

<script setup lang="ts">
import { speechToTextValidation } from "~/validationSchema/speechToTextValidation";
const languages = [{
  label: "En-US",
  value: "en-US",
},
{
  label: "En-IN",
  value: "en-in",
},
{
  label: "Hindi",
  value: "hindi",
},
{
  label: "Tamil",
  value: "tamil",
},
];
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
]);
const adaptations = [
  {
    label: "Yes",
    value: "true",
  },
  {
    label: "No",
    value: "false",
  },
]
const models = [
  {
    label: "Long",
    value: "long"
  }, {
    label: "Short",
    value: "short"
  }, {
    label: "Nova-2",
    value: "nova-2"
  },
  {
    label: "Nova",
    value: "nova"
  },
  {
    label: "Enhanced",
    value: "enhanced"
  },
  {
    label: "Base",
    value: "base"
  }
]

const route = useRoute("bot-management-voice-bot-id-speech-to-text-config");
const {
  handleSubmit,
  defineField,
  errors,
  setFieldValue,
  values,
  handleReset,
} = useForm({
  validationSchema: toTypedSchema(speechToTextValidation),
});

const { data: botData, status: botLoadingStatus } = await useLazyFetch<{
  speechToTextConfig: Record<string, string>;
}>(`/api/voicebots/${route.params.id}`);
if (botData.value && botData.value.speechToTextConfig) {
  setFieldValue("language", botData.value.speechToTextConfig.language);
  setFieldValue("provider", botData.value.speechToTextConfig.provider);
}

const createEditSpeecToTextConfig = handleSubmit(async (value) => {
  console.log({ value })
  await $fetch(`/api/voicebots/${route.params.id}`, {
    method: "PUT",
    body: {
      speechToTextConfig: { ...value },
    },
  });
});
watch(values, (newValues) => {
  if (newValues.language === "tamil" || newValues.language === "hindi") {
    console.log("HI IT CHANGED")
    providers.value = [
      {
        label: "Google",
        value: "google",
      },
    ];
  }
});

watch(errors, (newError) => {
  console.log({ newError });
});


</script>
