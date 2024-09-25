<template>
  <Page title="Speech To Text Configurations">
    <form @submit="createEditSpeecToTextConfig">
      <div class='grid grid-cols-2 gap-2 w-full'>
        <SelectField name="language" :options="languages" label="Language" placeholder="Select Language"
          helperText="Select your language.">
        </SelectField>
        <SelectField name="provider" :options="providers" label="provider" placeholder="Select provider"
          helperText="Select your provider.">
        </SelectField>
        <SelectField v-if="values.provider === 'google'" name="adaptation" :options="adaptations" label="adaptation"
          placeholder="Select adaptation" helperText="Select your adaptation.">
        </SelectField>
        <SelectField v-if="values.provider === 'google' || values.provider === 'deepgram'" name="model"
          :options="models" label="model" placeholder="Select model" helperText="Select your model.">
        </SelectField>
            
        <div   class="flex flex-col gap-2 mt-5">
          <RangeSlider
          :step="0.1"
          :name="parseFloat(values.amplificationFactor )"
          label="Amplification Factor"
          @update="
            ($event) => {
              setFieldValue('amplificationFactor', $event.toString());
            }
          "
          required
          placeholder="Enter speaking Rate"
          min="0"
          max="4"
        />
        </div>



        <TextField v-if="values.provider === 'deepgram'" label="Utterance End Ms" name="utteranceEndMs" required
          placeholder="Utterance End Ms" disableCharacters />

        <TextField v-if="values.provider === 'deepgram'" label="End pointing" name="endpointing" required
          placeholder="Enter endpointing" disableCharacters />
      </div>
      <div class="mb-2">
        <FieldArray v-if="values.provider === 'deepgram'" name="keywords" v-slot="{ fields, push, remove }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <div class='flex items-end gap-2 mt-2'>
              <TextField :label="`keyword ${idx + 1}`" :id="`value_${idx}`" :name="`keywords[${idx}].value`" required
                placeholder="Enter keyword" />
              <TextField :label="`boost value ${idx + 1}`" :id="`value_${idx}`" :name="`keywords[${idx}].boostValue`"
                required placeholder="Enter Boost value" disableCharacters />
              <UiButton variant="outline" type="button" @click="remove(idx)">
                <CloseIcon class="w-4 h-4" />
              </UiButton>
            </div>
          </fieldset>
          <div class='flex justify-end w-full'>
            <UiButton class='mt-2' variant="outline" type="button" @click="push({ value: '' })">
              Add keyword
            </UiButton>
          </div>
        </FieldArray>
        <FieldArray v-if="values.provider === 'google' || values.provider === 'azure'" name="phraseSets"
          v-slot="{ fields, push, remove }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <div class='flex items-end gap-2 mt-2'>
              <TextField :label="`phrase ${values.provider === 'azure' ? 'list' : 'set'} ${idx + 1}`"
                :id="`value_${idx}`" :name="`phraseSets[${idx}].value`" required placeholder="Enter phrase" />
              <UiButton v-if="values.provider !== 'google'" variant="outline" type="button" @click="remove(idx)"
                :disabled="idx === 0">
                <CloseIcon class="w-4 h-4" />
              </UiButton>
            </div>
          </fieldset>
          <div v-if="values.provider !== 'google'" class='flex justify-end w-full'>
            <UiButton class='mt-2' variant="outline" type="button" @click="push({ value: '' })">
              Add phrase set
            </UiButton>
          </div>
        </FieldArray>
      </div>
      <div class="flex w-full justify-end">
        <UiButton color="primary"> Submit </UiButton>
      </div>
    </form>
  </Page>
</template>

<script setup lang="ts">
import { FieldArray } from 'vee-validate';
import CloseIcon from '~/components/icons/CloseIcon.vue';
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
const models = ref([
  {
    label: "Long",
    value: "long"
  }, {
    label: "Short",
    value: "short"
  }
]
)
const route = useRoute("bot-management-voice-bot-id-speech-to-text-config");
const {
  handleSubmit,
  defineField,
  errors,
  setFieldValue,
  values,
  handleReset,
    resetForm
} = useForm({
  validationSchema: toTypedSchema(speechToTextValidation),
  initialValues: {
    phraseSets: [{ value: '' }],
    keywords: [{ value: '', boostValue: '1' }]

  }
});

const { data: botData, status: botLoadingStatus } = await useLazyFetch<{
  speechToTextConfig: Record<string, string>;
}>(`/api/voicebots/${route.params.id}`);

watch(botData,(newValue)=>{
 console.log(botData.value.speechToTextConfig, "SPEECH TO TEXT")
    resetForm();

  setFieldValue("language", botData.value.speechToTextConfig.language);
  setFieldValue("provider", botData.value.speechToTextConfig.provider);
  setFieldValue("amplificationFactor", botData.value.speechToTextConfig.amplificationFactor);
  setFieldValue("endpointing", botData.value.speechToTextConfig.endpointing);
  setFieldValue("utteranceEndMs", botData.value.speechToTextConfig.utteranceEndMs);

})

if (botData.value && botData.value.speechToTextConfig) {
 

}

const createEditSpeecToTextConfig = handleSubmit(async (value) => {
  console.log({ value })
  await $fetch(`/api/voicebots/${route.params.id}`, {
    method: "PUT",
    body: {
      speechToTextConfig: { ...value },
    },
  });
  toast.success("Updated successfully");

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
  else {
    providers.value = [
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
      }
    ]
  }
  if (newValues.provider === "deepgram") {
    models.value = [
      {
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
  } else {
    models.value = [
      {
        label: "Long",
        value: "long"
      }, {
        label: "Short",
        value: "short"
      }
    ]
  }
});

watch(errors, (newError) => {
  console.log({ newError });
});


</script>
