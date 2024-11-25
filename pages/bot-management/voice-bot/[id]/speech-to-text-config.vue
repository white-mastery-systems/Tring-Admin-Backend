<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <Page v-else title="Speech To Text Configurations" :bread-crumbs="[
    {
      label: `${botDetails.name}`,
      to: `/bot-management/voice-bot/${botDetails.id}`,
    },
    {
      label: 'Speech To Text Configurations',
      to: `/bot-management/voice-bot/${botDetails.id}/speech-to-text-config`,
    },
  ]">
    <div class="pb-2 sm:pb-0">
      <form @submit.prevent="createEditSpeecToTextConfig" class="space-y-3">
        <div class='grid grid-cols-2 gap-2 w-full'>
          <!-- <SelectField name="language" :options="languageList" label="Language" placeholder="Select Language"
            helperText="Select your language.">
          </SelectField> -->
          <SelectField name="provider" :options="providers" label="Provider" placeholder="Select provider"
            helperText="Select your provider." required>
          </SelectField>
          <SelectField v-if="values.provider === 'google'" name="adaptation" :options="adaptations" label="Adaptation"
            placeholder="Select adaptation" helperText="Select your adaptation." required>
          </SelectField>
          <SelectField v-if="values.provider === 'google'" name="googlemodel" :options="models" label="Model"
            placeholder="Select Model" helperText="Select your model." required>
          </SelectField>
          <SelectField v-if="values.provider === 'deepgram'" name="model" :options="models" label="Model"
            placeholder="Select Model" helperText="Select your model.">
          </SelectField>
          <!-- v-if="(values.provider === 'azure')" -->
          <div class="flex flex-col gap-2 mt-5">
            <RangeSlider :step="0.05" :name="parseFloat(values.amplificationFactor)" label="Amplification Factor"
              @update="
              ($event) => {
                setFieldValue('amplificationFactor', $event);
              }
            " required placeholder="Enter speaking Rate" min="0" max="4" />
          </div>

          <TextField v-if="values.provider === 'deepgram'" label="Utterance End Ms" name="utteranceEndMs" required
            placeholder="Utterance End Ms" disableCharacters />
          <TextField v-if="values.provider === 'google'" label="Recognizer" name="recognizer" required
            placeholder="Enter Recognizer" />
          <TextField type="number" v-if="values.provider === 'deepgram'" label="End pointing" name="endpointing"
            required placeholder="Enter endpointing" disableCharacters />
          <!-- <div v-if="(values.provider === 'deepgram')" class="flex flex-col gap-2 mt-5">
            <RangeSlider :step="0.05" :name="parseFloat(values.assemblyaiamplificationFactor)"
              label="Amplification Factor" @update="($event) => {
              setFieldValue('assemblyaiamplificationFactor', $event);
                }
                " required placeholder="Enter speaking Rate" min="0" max="4" />
          </div> -->
          <TextField type="number" v-if="values.provider === 'assemblyai'" label="End pointing"
            name="endutterancesilencethreshold" required placeholder="Enter endpointing" disableCharacters />
        </div>
        <div class="mb-2">
          <FieldArray v-if="values.provider === 'deepgram'" name="keywords" v-slot="{ fields, push, remove }">
            <fieldset v-for="(field, idx) in fields" :key="field.key">
              <div class='flex items-end gap-2 mt-2'>
                <TextField :label="`keyword ${idx + 1}`" :id="`value_${idx}`" :name="`keywords[${idx}].value`"
                  placeholder="Enter keyword" />
                <TextField :label="`boost value ${idx + 1}`" :id="`value_${idx}`" :name="`keywords[${idx}].boostValue`"
                  placeholder="Enter Boost value" disableCharacters />
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
          <!-- {{ values.provider }} -->
          <FieldArray v-if="values.provider === 'assemblyai'" name="wordboost" v-slot="{ fields, push, remove }">
            <fieldset v-for="(field, idx) in fields" :key="field.key">
              <div class='flex items-end gap-2 mt-2'>
                <TextField :label="`keyword ${idx + 1}`" :id="`value_${idx}`" :name="`wordboost[${idx}].value`"
                  placeholder="Enter keyword" />
                <TextField :label="`boost value ${idx + 1}`" :id="`value_${idx}`" :name="`wordboost[${idx}].boostValue`"
                  placeholder="Enter Boost value" disableCharacters />
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
          <FieldArray v-if="values.provider === 'google'" name="phraseSets" v-slot="{ fields, push, remove }">
            <fieldset v-for="(field, idx) in fields" :key="field.key">
              <div class='flex items-end gap-2 mt-2'>
                <TextField :label="`phrase set ${idx + 1}`" :id="`value_${idx}`" :name="`phraseSets[${idx}].value`"
                  required placeholder="Enter phrase" />
                <UiButton v-if="(values.provider === 'google') || (values.provider !== 'azure')" variant="outline"
                  type="button" @click="remove(idx)" :disabled="idx === 0">
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
          <FieldArray v-if="values.provider === 'azure'" name="phraseLists" v-slot="{ fields, push, remove }">
            <fieldset v-for="(field, idx) in fields" :key="field.key">
              <div class='flex items-end gap-2 mt-2'>
                <TextField :label="`phrase list ${idx + 1}`" :id="`value_${idx}`" :name="`phraseLists[${idx}].value`"
                  required placeholder="Enter phrase" />
                <UiButton v-if="(values.provider === 'azure')" variant="outline" type="button" @click="remove(idx)"
                  :disabled="idx === 0">
                  <CloseIcon class="w-4 h-4" />
                </UiButton>
              </div>
            </fieldset>
            <div class='flex justify-end w-full'>
              <UiButton class='mt-2' variant="outline" type="button" @click="push({ value: '' })">
                Add phrase list
              </UiButton>
            </div>
          </FieldArray>
        </div>
        <div class="flex w-full justify-end mt-4">
          <UiButton type="text" color="primary" :loading="isLoading">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>

<script setup lang="ts">
  import { FieldArray } from "vee-validate";
  import CloseIcon from "~/components/icons/CloseIcon.vue";
  import { speechToTextValidation } from "~/validationSchema/speechToTextValidation";
  // import { useLanguageList } from '~/composables/useLanguageList';

  // const languages = [
  //   {
  //     label: "En-US",
  //     value: "en-US",
  //   },
  //   {
  //     label: "En-IN",
  //     value: "en-in",
  //   },
  //   {
  //     label: "Hindi",
  //     value: "hindi",
  //   },
  //   {
  //     label: "Tamil",
  //     value: "tamil",
  //   },
  // ];
  // const { languageList } = useLanguageList();
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
  const adaptations = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];
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
  const route = useRoute("bot-management-voice-bot-id-speech-to-text-config");
  const isLoading = ref(false);

  const { data: botData, status: botLoadingStatus } = await useLazyFetch<{
    speechToTextConfig: Record<string, string>;
  }>(`/api/voicebots/${route.params.id}`);

  const {
    handleSubmit,
    defineField,
    errors,
    setFieldValue,
    values,
    handleReset,
    resetForm,
  } = useForm({
    validationSchema: toTypedSchema(speechToTextValidation),
    initialValues: {
      // phraseSets: [],
      // keywords: [],
    },
  });


  const botDetails: any = ref(await getVoiceBotDetails(route.params.id));

  const isPageLoading = computed(() => botLoadingStatus.value === "pending");


const phraseArrayName = computed(() => {
  return values.provider === 'azure' ? 'phraseLists' : 'phraseSets';
});

  watchEffect(() => {
    if (botDetails.value) {
      const userName = botDetails.value?.name ?? "Unknown Bot Name";
      useHead({
        title: `Voice Bot | ${userName} - Speech To Text Config`,
      });
    }
  });

  watch(botData, (newValue) => {
    resetForm();
    // setFieldValue("language", botData.value?.speechToTextConfig.language);
    setFieldValue("provider", botData.value?.speechToTextConfig.provider);
    const phraseList = botData.value?.speechToTextConfig.azure?.phrase_list || [];
    const formattedPhraseList = phraseList.map((item: any) => ({ value: item }));
    setFieldValue("phraseLists", formattedPhraseList)
    const phraseSetList = botData.value?.speechToTextConfig.google?.phrase_sets || [];
    const formattedPhrasSeteList = phraseSetList?.map((item: any) => ({ value: item }));
    setFieldValue("phraseSets", formattedPhrasSeteList)
    setFieldValue(
      "assemblyaiamplificationFactor",
      botData.value?.speechToTextConfig.deepgram.amplification_factor,
    );
    setFieldValue(
      "amplificationFactor",
      botData.value?.speechToTextConfig.azure.amplification_factor,
    );
    setFieldValue("endpointing", botData.value?.speechToTextConfig.deepgram.endpointing);
    setFieldValue("adaptation", botData.value?.speechToTextConfig?.google?.adaptation)
    setFieldValue("recognizer", botData.value?.speechToTextConfig.google?.recognizer || '')
    setFieldValue("endutterancesilencethreshold", botData.value?.speechToTextConfig.assemblyai?.end_utterance_silence_threshold)
    const word_boost_key = botData.value?.speechToTextConfig.assemblyai?.word_boost || [];
    const formatted_boost_key = word_boost_key.map((keyword: any) => {
      const [value, boostValue] = keyword.split(":");
      return { value, boostValue };
    })
    setFieldValue("wordboost", formatted_boost_key)
      setFieldValue(
        "utteranceEndMs",
        botData.value?.speechToTextConfig.deepgram.utterance_end_ms,
      );
      if (values.provider === "deepgram") {
        setFieldValue(
          "model",
          botData.value?.speechToTextConfig.deepgram.model
        );
      } else if (values.provider === "google") {
        setFieldValue(
          "googlemodel",
          botData.value?.speechToTextConfig.google.model
        );
      }
      const keywords = botData.value?.speechToTextConfig.deepgram?.keywords || [];
      const formattedKeywords = keywords.map(keyword => {
        const [value, boostValue] = keyword.split(":");
        return {value, boostValue };
      })
      setFieldValue(
        "keywords",
        formattedKeywords.length ? formattedKeywords : []
      );
  });
  watch(errors, (newValues) => {
    console.log(newValues);
    if (newValues) {
      console.log("ERRORS", newValues);
    }
  });
watch(
  () => toRaw(values.provider),
  (newValue) => {
    // setFieldValue("language", botData.value?.speechToTextConfig.language);
    // setFieldValue("provider", botData.value?.speechToTextConfig.provider);
    const phraseList = botData.value?.speechToTextConfig.azure?.phrase_list || [];
    const formattedPhraseList = phraseList?.map((item: any) => ({ value: item }));
    const phraseSetList = botData.value?.speechToTextConfig.google?.phrase_sets || [];
    const formattedPhrasSeteList = phraseSetList?.map((item: any) => ({ 
      value: item
     }));
    setFieldValue("phraseSets", formattedPhrasSeteList);
    // setFieldValue(
    //   "amplificationFactor",
    //   botData.value?.speechToTextConfig[botData.value?.speechToTextConfig.provider].amplification_factor,
    // );
    // setFieldValue(
    //   "assemblyaiamplificationFactor",
    //   botData.value?.speechToTextConfig.deepgram.amplification_factor,
    // );
    setFieldValue(
      "amplificationFactor",
      botData.value?.speechToTextConfig[botData.value?.speechToTextConfig?.provider].amplification_factor,
    );
    setFieldValue("endpointing", botData.value?.speechToTextConfig.deepgram.endpointing);
    setFieldValue("adaptation", botData.value?.speechToTextConfig.google?.adaptation)
    setFieldValue("recognizer", botData.value?.speechToTextConfig.google?.recognizer || '')
    setFieldValue("endutterancesilencethreshold", botData.value?.speechToTextConfig.assemblyai?.end_utterance_silence_threshold)
    const word_boost_key = botData.value?.speechToTextConfig.assemblyai?.word_boost || [];
    const formatted_boost_key = word_boost_key?.map((keyword: any) => {
      const [value, boostValue] = keyword.split(":");
      return { value, boostValue };
    })
    setFieldValue("wordboost", formatted_boost_key)
      setFieldValue(
        "utteranceEndMs",
        botData.value?.speechToTextConfig.deepgram.utterance_end_ms,
      );
      // if (values.provider === "deepgram") {
        setFieldValue(
          "model",
          botData.value?.speechToTextConfig.deepgram.model
        );
      // } else if (values.provider === "google") {
        setFieldValue(
          "googlemodel",
          botData.value?.speechToTextConfig.google.model
        );
      // }
    const keywords = botData.value?.speechToTextConfig.deepgram?.keywords || [];
      const formattedKeywords = keywords?.map((keyword: any) => {
        const [value, boostValue] = keyword?.split(":");
        return { value, boostValue };
      })
      setFieldValue(
        "keywords",
        formattedKeywords.length ? formattedKeywords : []
      );
    }
);

const inputChanges = ($event: any) => {
  const numericValue = Number($event.target.value)
  // console.log(numericValue, "numericValue --- numericValue")
  setFieldValue('assemblyaiamplificationFactor', numericValue)
}

const createEditSpeecToTextConfig = handleSubmit(async (value) => {
  isLoading.value = true;
  // const getProvider = Object.keys(botData.value?.speechToTextConfig || {});

  const updatedConfig: any = {
    // language: value.language || botData.value?.speechToTextConfig.language || "en-IN",
    provider: value.provider || botData.value?.speechToTextConfig.provider || 'deepgram',
  };
  // Google config
  if (value.provider === "google") {
    updatedConfig.google = {
      model: value.googlemodel || 'short',
      adaptation: value.adaptation || true,
      phrase_sets: value.phraseSets?.map((item: any) => item.value || []),
      amplification_factor: value.amplificationFactor || 2,
    };
  }

  // Azure config
  else if (value.provider === "azure") {
    updatedConfig.azure = {
      phrase_list: value.phraseLists?.map((item: any) => item.value) || [],
      amplification_factor: value.amplificationFactor || 2,
    };
  }

  // Deepgram config
  else if (value.provider === "deepgram") {
    updatedConfig.deepgram = {
      model: value.model || 'nova-2',
      keywords: value.keywords?.map((keywordObj: any) => `${keywordObj.value}:${keywordObj.boostValue}`) || [],
        
      endpointing: value.endpointing || 250,
      utterance_end_ms: String(value.utteranceEndMs) || '1000',
      amplification_factor: value.amplificationFactor || 2,
    };
  }
  // AssemblyAI config
  else if (value.provider === "assemblyai") {
    updatedConfig.assemblyai = {
      word_boost: value.wordboost?.map((keywordObj: any) => `${keywordObj.value}:${keywordObj.boostValue}` || []),
      end_utterance_silence_threshold: value.endUtteranceSilenceThreshold || 300,
      amplification_factor: value.amplificationFactor || 2,
    };
  }
  // getProvider.forEach((provider) => {
  // });

  // Uncomment to save changes
  await $fetch(`/api/voicebots/${route.params.id}`, {
    method: "PUT",
    body: {
      speechToTextConfig: updatedConfig,
    },
  });

  toast.success("Updated successfully");
  navigateTo({
    name: "bot-management-voice-bot-id",
    params: { id: route.params.id },
  });
  isLoading.value = false;
});



// const createEditSpeecToTextConfig = handleSubmit(async (value) => {
//   console.log('Form Values:', value);
//   isLoading.value = true;

//   // Ensure phraseSets and keywords are always arrays
//   const phraseSets = Array.isArray(value.phraseSets) ? value.phraseSets : [];
//   const keywords = Array.isArray(value.keywords) ? value.keywords : [];

//   const updatedConfig = {
//     language: value.language || botData.value.speechToTextConfig.language,
//     provider: value.provider || botData.value.speechToTextConfig.provider,

//     google: {
//       ...botData.value.speechToTextConfig.google,
//       adaptation: value.adaptation || botData.value.speechToTextConfig.google.adaptation,
//       model: value.model || botData.value.speechToTextConfig.google.model,
//       // Safely map phraseSets
//       phrase_sets: phraseSets.length > 0
//         ? phraseSets.map((item: any) => item.value) || []
//         : botData.value.speechToTextConfig.google.phrase_sets || [],
//       amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.google.amplification_factor
//     },

//     azure: {
//       ...botData.value.speechToTextConfig.azure,
//       // Safely map phraseSets for Azure
//       phrase_list: phraseSets.length > 0
//         ? phraseSets.map((item: any) => item.value)
//         : botData.value.speechToTextConfig.azure.phrase_list,
//       amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.azure.amplification_factor
//     },

//     deepgram: {
//       ...botData.value.speechToTextConfig.deepgram,
//       amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.deepgram.amplification_factor,
//      : {
//         ...botData.value.speechToTextConfig.deepgram,
//         model: value.model || botData.value.speechToTextConfig.deepgram.model,
//         endpointing: value.endpointing || botData.value.speechToTextConfig.deepgram.endpointing,
//         utterance_end_ms: value.utteranceEndMs !== undefined
//           ? String(value.utteranceEndMs)
//           : botData.value.speechToTextConfig.deepgram.utterance_end_ms,
//         // Safely map keywords
//         keywords: keywords.length > 0
//           ? keywords.map(keywordObj => `${keywordObj.value}:${keywordObj.boostValue}`)
//           : botData.value.speechToTextConfig.deepgram.keywords || []
//       }
//     }
//   };

//   console.log('Updated Config:', updatedConfig);

//   // Uncomment this block when you are ready to save the changes
//   // await $fetch(`/api/voicebots/${route.params.id}`, {
//   //   method: "PUT",
//   //   body: {
//   //     speechToTextConfig: updatedConfig,
//   //   },
//   // });

//   toast.success("Updated successfully");
//   isLoading.value = false;
// });



watch(values, (newValues) => {
  if (newValues.provider === "deepgram") {
    models.value = JSON.parse(JSON.stringify([
      { label: "Nova-2", value: "nova-2" },
      { label: "Nova", value: "nova" },
      { label: "Enhanced", value: "enhanced" },
      { label: "Base", value: "base" },
    ]));
  } else if (newValues.provider === "google") {
    models.value = JSON.parse(JSON.stringify([
      { label: "Long", value: "long" },
      { label: "Short", value: "short" },
    ]));
  } else {
    // or other providers if needed
    models.value = [];
  }
});

  watch(errors, (newError) => {});
</script>
