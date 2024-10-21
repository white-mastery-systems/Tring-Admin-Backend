<template>
  <div v-if="isPageLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
    <Icon name="svg-spinners:90-ring-with-bg" class="h-20 w-20" />
  </div>
  <Page v-else title="Speech To Text Configurations">
    <div class="pb-2 sm:pb-0">
      <form @submit="createEditSpeecToTextConfig">
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
                setFieldValue('amplificationFactor', $event.toString());
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
      value: "true",
    },
    {
      label: "No",
      value: "false",
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
      phraseSets: [{ value: "" }],
      keywords: [{ value: "", boostValue: "1" }],
    },
  });

  const { data: botData, status: botLoadingStatus } = await useLazyFetch<{
    speechToTextConfig: Record<string, string>;
  }>(`/api/voicebots/${route.params.id}`);

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
    console.log(botData.value, "botData")
    setFieldValue("language", botData.value.speechToTextConfig.language);
    setFieldValue("provider", botData.value.speechToTextConfig.provider);
    const phraseList = botData.value.speechToTextConfig.azure?.phrase_list || [];
    const formattedPhraseList = phraseList.map(item => ({ value: item }));
    setFieldValue("phraseSets", formattedPhraseList)
    setFieldValue(
      "amplificationFactor",
      botData.value.speechToTextConfig[botData.value.speechToTextConfig.provider].amplification_factor,
    );
    if (botData.value.speechToTextConfig.provider === "deepgram") {
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
      } else {
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
        formattedKeywords.length ? formattedKeywords : [{ value: "", boostValue: "" }]
      );
    }
  });

  if (botData.value && botData.value.speechToTextConfig) {
  }

  const createEditSpeecToTextConfig = handleSubmit(async (value) => {
    console.log({ value }, "value -- value");
    console.log(botData.value.speechToTextConfig, "botData.value.speechToTextConfig")
    isLoading.value = true;


      const updatedConfig = {
        language: value.language || botData.value.speechToTextConfig.language,
        provider: value.provider || botData.value.speechToTextConfig.provider,
        google: {
          ...botData.value.speechToTextConfig.google,
          adaptation: value.adaptation || botData.value.speechToTextConfig.google.adaptation,
          model: value.model || botData.value.speechToTextConfig.google.model,
          phrase_sets: value.phraseSets.length ? value.phraseSets : botData.value.speechToTextConfig.google.phrase_sets,
          amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.google.amplification_factor
        },
        azure: {
          ...botData.value.speechToTextConfig.azure,
          phrase_list: value.phraseSets.length ? value.phraseSets : botData.value.speechToTextConfig.azure.phrase_list,
          amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.azure.amplification_factor
        },
        deepgram: {
          ...botData.value.speechToTextConfig.deepgram,
          amplification_factor: value.amplificationFactor || botData.value.speechToTextConfig.deepgram.amplification_factor,
          live_options: {
            ...botData.value.speechToTextConfig.deepgram.live_options,
            model: value.model || botData.value.speechToTextConfig.deepgram.live_options.model,
            endpointing: value.endpointing || botData.value.speechToTextConfig.deepgram.live_options.endpointing,
            utterance_end_ms: value.utteranceEndMs !== undefined ? String(value.utteranceEndMs) : botData.value.speechToTextConfig.deepgram.live_options.utterance_end_ms,

            keywords: value.keywords ? value.keywords.map(keywordObj => {
              return `${keywordObj.value}:${keywordObj.boostValue}`;
            }) : botData.value.speechToTextConfig.deepgram.live_options.keywords
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
    isLoading.value = false;
  });
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
