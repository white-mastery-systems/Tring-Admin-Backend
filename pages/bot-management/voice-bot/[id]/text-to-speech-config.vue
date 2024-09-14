<template>
  <Page title="Speech To Text Configurations">
    <UiForm>
      <UiFormField
        v-model="providerField"
        v-bind="providerFieldAttrs"
        name="intent"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Providers<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="providerField" v-bind="providerFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Intent" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="intent in providers"
                  :value="intent.value"
                  >{{ intent.label }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">
            {{ errors.provider }}
          </span>
          <span class="text-xs text-gray-500">Select your providers.</span>
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

  let providers = [
    {
      label: "Google",
      value: "google",
    },
    {
      label: "Eleven Labs",
      value: "eleventlabs",
    },
    {
      label: "Deepgram",
      value: "deepgram",
    },
  ];

  const route = useRoute("bot-management-voice-bot-id-text-to-speech-config");
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

  watch(errors, (newError) => {
    console.log({ newError });
  });
  const [langauageField, langauageFieldAttrs] = defineField("language");
  const [providerField, providerFieldAttrs] = defineField("provider");
</script>
