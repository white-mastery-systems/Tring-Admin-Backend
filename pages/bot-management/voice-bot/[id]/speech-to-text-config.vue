<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <Page v-else title="Speech To Text Configurations">
    <div class="pb-2 sm:pb-0">
      <form @submit.prevent="createEditSpeecToTextConfig">
        <div class='grid grid-cols-2 gap-2 w-full'>
          <SelectField name="language" :options="languageList" label="Language" placeholder="Select Language"
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

          <div class="flex flex-col gap-2 mt-5">
            <RangeSlider :step="0.1" :name="parseFloat(values.amplificationFactor )" label="Amplification Factor"
              @update="
              ($event) => {
                setFieldValue('amplificationFactor', $event);
              }
            " required placeholder="Enter speaking Rate" min="0" max="4" />
          </div>



          <TextField v-if="values.provider === 'deepgram'" label="Utterance End Ms" name="utteranceEndMs" required
            placeholder="Utterance End Ms" disableCharacters />

          <TextField type="number" v-if="values.provider === 'deepgram'" label="End pointing" name="endpointing"
            required placeholder="Enter endpointing" disableCharacters />
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
          <FieldArray v-if="values.provider === 'google' || values.provider === 'azure'" name="phraseSets"
            v-slot="{ fields, push, remove }">
            <fieldset v-for="(field, idx) in fields" :key="field.key">
              <div class='flex items-end gap-2 mt-2'>
                <TextField :label="`phrase ${values.provider === 'azure' ? 'list' : 'set'} ${idx + 1}`"
                  :id="`value_${idx}`" :name="`phraseSets[${idx}].value`" required placeholder="Enter phrase" />
                <UiButton v-if="(values.provider === 'google') || (values.provider !== 'azure')" variant="outline"
                  type="button" @click="remove(idx)" :disabled="idx === 0">
                  <CloseIcon class="w-4 h-4" />
                </UiButton>
              </div>
            </fieldset>
            <div v-if="values.provider !== 'deepgram'" class='flex justify-end w-full'>
              <UiButton class='mt-2' variant="outline" type="button" @click="push({ value: '' })">
                Add phrase set
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
  import { useLanguageList } from '~/composables/useLanguageList';

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
  const { languageList } = useLanguageList();
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
    setFieldValue("language", botData.value.speechToTextConfig.language);
    setFieldValue("provider", botData.value.speechToTextConfig.provider);
    const phraseList = botData.value.speechToTextConfig.azure?.phrase_list || [];
    const formattedPhraseList = phraseList.map(item => ({ value: item }));
    setFieldValue("phraseSets", formattedPhraseList)
    setFieldValue(
      "amplificationFactor",
      botData.value.speechToTextConfig[botData.value.speechToTextConfig.provider].amplification_factor,
    );
      setFieldValue("endpointing", botData.value.speechToTextConfig.deepgram.live_options.endpointing);
      setFieldValue("adaptation", botData.value.speechToTextConfig?.google?.adaptation)
      setFieldValue(
        "utteranceEndMs",
        botData.value.speechToTextConfig.deepgram.live_options.utterance_end_ms,
      );
      if (values.provider === "deepgram") {
        console.log(botData.value.speechToTextConfig, "botData.value.speechToTextConfig")
        setFieldValue(
          "model",
          botData.value.speechToTextConfig.deepgram.live_options.model
        );
      } else if (values.provider === "google") {
        setFieldValue(
          "model",
          botData.value.speechToTextConfig.google.model
        );
      }
      const keywords = botData.value.speechToTextConfig.deepgram.live_options?.keywords || [];
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
    console.log(newValues, values);
    if (newValues) {
      console.log("ERRORS", newValues);
    }
  });
watch(
  () => toRaw(values.provider),
  (newValue) => {
    setFieldValue("language", botData.value.speechToTextConfig.language);
    // setFieldValue("provider", botData.value.speechToTextConfig.provider);
    const phraseList = botData.value.speechToTextConfig.azure?.phrase_list || [];
    const formattedPhraseList = phraseList.map(item => ({ value: item }));
    setFieldValue("phraseSets", formattedPhraseList)
    setFieldValue(
      "amplificationFactor",
      botData.value.speechToTextConfig[botData.value.speechToTextConfig.provider].amplification_factor,
    );
    setFieldValue("endpointing", botData.value.speechToTextConfig.deepgram.live_options.endpointing);
    setFieldValue("adaptation", botData.value.speechToTextConfig.google?.adaptation)
      setFieldValue(
        "utteranceEndMs",
        botData.value.speechToTextConfig.deepgram.live_options.utterance_end_ms,
      );
      if (values.provider === "deepgram") {
        setFieldValue(
          "model",
          botData.value.speechToTextConfig.deepgram.live_options.model
        );
      } else if (values.provider === "google") {
        setFieldValue(
          "model",
          botData.value.speechToTextConfig.google.model
        );
      }
      const keywords = botData.value.speechToTextConfig.deepgram.live_options?.keywords || [];
    console.log(keywords, "keywords -sdd")
      const formattedKeywords = keywords.map(keyword => {
        const [value, boostValue] = keyword.split(":");
        return { value, boostValue };
      })
    console.log(formattedKeywords, "formattedKeywords -- werw")
      setFieldValue(
        "keywords",
        formattedKeywords.length ? formattedKeywords : []
      );
    }
);

  const createEditSpeecToTextConfig = handleSubmit(async (value) => {
    isLoading.value = true;
      // const updatedConfig = {
      //   language: value.language || botData.value.speechToTextConfig.language,
      //   provider: value.provider || botData.value.speechToTextConfig.provider,
      //   google: {
      //     ...botData.value.speechToTextConfig.google,
      //     adaptation: value.adaptation || botData.value.speechToTextConfig.google?.adaptation,
      //     model: value.model || botData.value.speechToTextConfig.google?.model,
      //     phrase_sets: value.phraseSets.length ? value.phraseSets?.map((item: any) => item.value) || [] : botData.value.speechToTextConfig.google?.phrase_sets,
      //     amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.google.amplification_factor
      //   },
      //   azure: {
      //     ...botData.value.speechToTextConfig.azure,
      //     phrase_list: value.phraseSets.length ? value.phraseSets?.map((item: any) => item.value) : botData.value.speechToTextConfig.azure?.phrase_list,
      //     amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.azure?.amplification_factor
      //   },
      //   deepgram: {
      //     ...botData.value.speechToTextConfig.deepgram,
      //     amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.deepgram?.amplification_factor,
      //     live_options: {
      //       ...botData.value.speechToTextConfig.deepgram.live_options,
      //       model: value.model || botData.value.speechToTextConfig.deepgram.live_options?.model,
      //       endpointing: value.endpointing || botData.value.speechToTextConfig.deepgram.live_options?.endpointing,
      //       utterance_end_ms: value.utteranceEndMs !== undefined ? String(value.utteranceEndMs) : botData.value.speechToTextConfig.deepgram.live_options?.utterance_end_ms,
      //       keywords: value.keywords ? value.keywords?.map(keywordObj => {
      //         return `${keywordObj.value}:${keywordObj.boostValue}`;
      //       }) : botData.value.speechToTextConfig.deepgram.live_options?.keywords || []
      //     }
      //   }
      // };
    // const updatedConfig = {
    //   language: value.language || botData.value.speechToTextConfig.language,
    //   provider: value.provider || botData.value.speechToTextConfig.provider,

    //   // Google config
    //   google: {
    //     adaptation: value.adaptation !== undefined
    //       ? value.adaptation
    //       : botData.value.speechToTextConfig.google?.adaptation || false,
    //     model: value.model || botData.value.speechToTextConfig.google?.model || '',
    //     phrase_sets: value.phraseSets?.length
    //       ? value.phraseSets.map((item: any) => item.value)
    //       : botData.value.speechToTextConfig.google?.phrase_sets || [],
    //     amplification_factor: value.amplificationFactor !== undefined
    //       ? value.amplificationFactor
    //       : botData.value.speechToTextConfig.google?.amplification_factor || 1,
    //     encoding: botData.value.speechToTextConfig.google?.encoding || 'MULAW',
    //     noise_gate: botData.value.speechToTextConfig.google?.noise_gate || 0,
    //     sample_rate_hertz: botData.value.speechToTextConfig.google?.sample_rate_hertz || 8000,
    //     audio_channel_count: botData.value.speechToTextConfig.google?.audio_channel_count || 1,
    //     response_timeout: botData.value.speechToTextConfig.google?.response_timeout || 5,
    //   },

    //   // Azure config
    //   azure: {
    //     phrase_list: value.phraseSets?.length
    //       ? value.phraseSets.map((item: any) => item.value)
    //       : botData.value.speechToTextConfig.azure?.phrase_list || [],
    //     amplification_factor: value.amplificationFactor !== undefined
    //       ? value.amplificationFactor
    //       : botData.value.speechToTextConfig.azure?.amplification_factor || 1,
    //     encoding: botData.value.speechToTextConfig.azure?.encoding || 'MULAW',
    //     noise_gate: botData.value.speechToTextConfig.azure?.noise_gate || 0,
    //     sample_rate_hertz: botData.value.speechToTextConfig.azure?.sample_rate_hertz || 8000,
    //     audio_channel_count: botData.value.speechToTextConfig.azure?.audio_channel_count || 1,
    //   },

    //   // Deepgram config
    //   deepgram: {
    //     amplification_factor: value.amplificationFactor !== undefined
    //       ? value.amplificationFactor
    //       : botData.value.speechToTextConfig.deepgram?.amplification_factor || 1,
    //     addons: botData.value.speechToTextConfig.deepgram?.addons || { dictation: 'false', measurements: 'false' },
    //     version: botData.value.speechToTextConfig.deepgram?.version || '1',
    //     encoding: botData.value.speechToTextConfig.deepgram?.encoding || 'MULAW',
    //     noise_gate: botData.value.speechToTextConfig.deepgram?.noise_gate || 0,
    //     live_options: {
    //       model: value.model || botData.value.speechToTextConfig.deepgram?.live_options?.model || '',
    //       endpointing: value.endpointing !== undefined
    //         ? value.endpointing
    //         : botData.value.speechToTextConfig.deepgram?.live_options?.endpointing || 0,
    //       utterance_end_ms: value.utteranceEndMs !== undefined
    //         ? String(value.utteranceEndMs)
    //         : botData.value.speechToTextConfig.deepgram?.live_options?.utterance_end_ms || '0',
    //       keywords: value.keywords?.length
    //         ? value.keywords.map(keywordObj => `${keywordObj.value}:${keywordObj.boostValue}`)
    //         : botData.value.speechToTextConfig.deepgram?.live_options?.keywords || [],
    //       diarize: botData.value.speechToTextConfig.deepgram?.live_options?.diarize || false,
    //       sample_rate: botData.value.speechToTextConfig.deepgram?.live_options?.sample_rate || 8000,
    //       channels: botData.value.speechToTextConfig.deepgram?.live_options?.channels || 1,
    //       no_delay: botData.value.speechToTextConfig.deepgram?.live_options?.no_delay || false,
    //       numerals: botData.value.speechToTextConfig.deepgram?.live_options?.numerals || false,
    //       punctuate: botData.value.speechToTextConfig.deepgram?.live_options?.punctuate || false,
    //     }
    //   }
    // };

    const updatedConfig = {
      language: value.language || botData.value.speechToTextConfig.language,
      provider: value.provider || botData.value.speechToTextConfig.provider || 'deepgram', // Default provider

      // Google config
      google: {
        adaptation: value.adaptation !== undefined
          ? value.adaptation
          : botData.value.speechToTextConfig.google?.adaptation || true,
        model: value.model || botData.value.speechToTextConfig.google?.model || 'short',
        phrase_sets: value.phraseSets?.length
          ? value.phraseSets.map((item: any) => item.value)
          : botData.value.speechToTextConfig.google?.phrase_sets || [
            'projects/302328048464/locations/global/phraseSets/appointment-en'
          ],
        amplification_factor: value.amplificationFactor !== undefined
          ? value.amplificationFactor
          : botData.value.speechToTextConfig.google?.amplification_factor || 3,
        encoding: botData.value.speechToTextConfig.google?.encoding || 'MULAW',
        noise_gate: botData.value.speechToTextConfig.google?.noise_gate || 0,
        sample_rate_hertz: botData.value.speechToTextConfig.google?.sample_rate_hertz || 8000,
        audio_channel_count: botData.value.speechToTextConfig.google?.audio_channel_count || 1,
        response_timeout: botData.value.speechToTextConfig.google?.response_timeout || 1,
        recognizer: botData.value.speechToTextConfig.google?.recognizer || 'projects/tringai-project1/locations/global/recognizers/english-in-short',
      },

      // Azure config
      azure: {
        phrase_list: value.phraseSets?.length
          ? value.phraseSets.map((item: any) => item.value)
          : botData.value.speechToTextConfig.azure?.phrase_list || [],
        amplification_factor: value.amplificationFactor !== undefined
          ? value.amplificationFactor
          : botData.value.speechToTextConfig.azure?.amplification_factor || 3,
        encoding: botData.value.speechToTextConfig.azure?.encoding || 'MULAW',
        noise_gate: botData.value.speechToTextConfig.azure?.noise_gate || 0,
        sample_rate_hertz: botData.value.speechToTextConfig.azure?.sample_rate_hertz || 8000,
        audio_channel_count: botData.value.speechToTextConfig.azure?.audio_channel_count || 1,
      },

      // Deepgram config
      deepgram: {
        amplification_factor: value.amplificationFactor !== undefined
          ? value.amplificationFactor
          : botData.value.speechToTextConfig.deepgram?.amplification_factor || 2,
        addons: botData.value.speechToTextConfig.deepgram?.addons || { dictation: 'true', measurements: 'true' },
        version: botData.value.speechToTextConfig.deepgram?.version || '1',
        encoding: botData.value.speechToTextConfig.deepgram?.encoding || 'MULAW',
        noise_gate: botData.value.speechToTextConfig.deepgram?.noise_gate || 0,
        live_options: {
          model: value.model || botData.value.speechToTextConfig.deepgram?.live_options?.model || 'nova-2',
          endpointing: value.endpointing !== undefined
            ? value.endpointing
            : botData.value.speechToTextConfig.deepgram?.live_options?.endpointing || 50,
          utterance_end_ms: value.utteranceEndMs !== undefined
            ? String(value.utteranceEndMs)
            : botData.value.speechToTextConfig.deepgram?.live_options?.utterance_end_ms || '1000',
          keywords: value.keywords?.length
            ? value.keywords.map(keywordObj => `${keywordObj.value}:${keywordObj.boostValue}`)
            : botData.value.speechToTextConfig.deepgram?.live_options?.keywords || [
              'double room:1', 'single room:1', 'chauffer:1', 'transport:1', '5000:1', '10000:1', 'amenities:1',
              'single bedroom:1', 'double bedroom:1', 'pricing:1', 'features:1', 'availability:1'
            ],
          diarize: botData.value.speechToTextConfig.deepgram?.live_options?.diarize || false,
          sample_rate: botData.value.speechToTextConfig.deepgram?.live_options?.sample_rate || 8000,
          channels: botData.value.speechToTextConfig.deepgram?.live_options?.channels || 1,
          no_delay: botData.value.speechToTextConfig.deepgram?.live_options?.no_delay || true,
          numerals: botData.value.speechToTextConfig.deepgram?.live_options?.numerals || true,
          punctuate: botData.value.speechToTextConfig.deepgram?.live_options?.punctuate || true,
          interim_results: botData.value.speechToTextConfig.deepgram?.live_options?.interim_results || true,
          filler_words: botData.value.speechToTextConfig.deepgram?.live_options?.filler_words || false,
          profanity_filter: botData.value.speechToTextConfig.deepgram?.live_options?.profanity_filter || true,
          vad_events: botData.value.speechToTextConfig.deepgram?.live_options?.vad_events || true,
        }
      }
    };

    await $fetch(`/api/voicebots/${route.params.id}`, {
      method: "PUT",
      body: {
        speechToTextConfig: updatedConfig,
      },
    });
    toast.success("Updated successfully");
    return navigateTo({
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
//       live_options: {
//         ...botData.value.speechToTextConfig.deepgram.live_options,
//         model: value.model || botData.value.speechToTextConfig.deepgram.live_options.model,
//         endpointing: value.endpointing || botData.value.speechToTextConfig.deepgram.live_options.endpointing,
//         utterance_end_ms: value.utteranceEndMs !== undefined
//           ? String(value.utteranceEndMs)
//           : botData.value.speechToTextConfig.deepgram.live_options.utterance_end_ms,
//         // Safely map keywords
//         keywords: keywords.length > 0
//           ? keywords.map(keywordObj => `${keywordObj.value}:${keywordObj.boostValue}`)
//           : botData.value.speechToTextConfig.deepgram.live_options.keywords || []
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
    if (newValues.language === "tamil" || newValues.language === "hindi") {
      console.log("HI IT CHANGED");
      providers.value = [
        {
          label: "Google",
          value: "google",
        },
      ];
    } else {
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
        },
      ];
    }
    if (newValues.provider === "deepgram") {
      models.value = [
        {
          label: "Nova-2",
          value: "nova-2",
        },
        {
          label: "Nova",
          value: "nova",
        },
        {
          label: "Enhanced",
          value: "enhanced",
        },
        {
          label: "Base",
          value: "base",
        },
      ];
    } else {
      models.value = [
        {
          label: "Long",
          value: "long",
        },
        {
          label: "Short",
          value: "short",
        },
      ];
    }
  });

  watch(errors, (newError) => {});
</script>
