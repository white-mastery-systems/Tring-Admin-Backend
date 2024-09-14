<template>
  <Page title="Speech To Text Configurations">
    <UiForm @submit="createEditSpeecToTextConfig()">
      <UiFormField
        v-model="langauageField"
        v-bind="langauageFieldAttrs"
        name="language"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Language<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="langauageField" v-bind="langauageFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Language" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="language in languages"
                  :value="language.value"
                  >{{ language.label }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">
            {{ errors.provider }}
          </span>
        </br>
          <span class="text-xs text-gray-500">Select your language.</span>
        </UiFormItem>
      </UiFormField>
      <!-- end of language -->
      <UiFormField
        v-model="providerField"
        v-bind="providerFieldAttrs"
        name="provider"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Providers<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="providerField" v-bind="providerFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Provider" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="provider in providers"
                  :value="provider.value"
                  >{{ provider.label }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">
            {{ errors.provider }}
          </span>
        </br>
          <span class="text-xs text-gray-500">Select your providers.</span>
        </UiFormItem>
      </UiFormField>


      <!-- end of provider -->

      <UiFormField
        v-model="adaptationField"
        v-bind="adaptationFieldAttrs"
        name="adaptation"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Adaptation<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="adaptationField" v-bind="adaptationFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select adaptation" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="adaptation in adaptations"
                  :value="adaptation.value"
                  >{{ adaptation.label }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">
            {{ errors.adaptation }}
          </span>
        </br>
          <span class="text-xs text-gray-500">Select your adaptation.</span>
        </UiFormItem>
  </UiFormField> 
        
     


      <!-- end of adaptations -->
       
<UiFormField
        v-model="modelField"
        v-bind="modelFieldAttrs"
        name="model"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Model<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="modelField" v-bind="modelFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Model" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="model in models"
                  :value="model.value"
                  >{{ model.label }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">
            {{ errors.model }}
          </span>
        </br>
          <span class="text-xs text-gray-500">Select your models.</span>
        </UiFormItem>
      </UiFormField>


      <div class="flex w-full justify-end">
        <UiButton color="primary"> Submit </UiButton>
      </div>
    </UiForm>
  </Page>
</template>

<script setup lang="ts">
  import { speechToTextValidation } from "~/validationSchema/speechToTextValidation";
  const languages = [
    {
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
  let providers = [
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
  const adaptations=[
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ]
  const models=[
    {
        label:"Long",
        value:"long"
    },{
        label:"Short",
        value:"short"
    },{
      label:"Nova-2",
      value:"nova-2"
    },
    {
      label:"Nova",
      value:"nova"
    },
    {
      label:"Enhanced",
      value:"enhanced"
    },
    {
      label:"Base",
      value:"base"
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
    await $fetch(`/api/voicebots/${route.params.id}`, {
      method: "PUT",
      body: {
        speechToTextConfig: { ...value },
      },
    });
  });
  watch(values, (newValues) => {
    if (newValues.language === "tamil" || newValues.language === "hindi") {
      providers = [
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
  const [langauageField, langauageFieldAttrs] = defineField("language");
  const [providerField, providerFieldAttrs] = defineField("provider");
  const [adaptationField, adaptationFieldAttrs] = defineField("adaptation");
  const [amplificationFactorField,amplificationFactorFieldAttrs]=defineField("amplification_factor")
  const [modelField,modelFieldAttrs]=defineField("model")


</script>
