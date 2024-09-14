<template>
  <Page title="Speech To Text Configurations">
    <!-- <UiForm @submit="handleTTlConfig()">
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

      <TextField
        name="adaptation"
        label="Adaptation"
        v-model="adaptationValue"
        placeholder="Adaptation Details"
        helperText="Enter adaptation"
        required
      />

      <div class="flex w-full justify-end">
        <UiButton color="primary"> Submit </UiButton>
      </div>
    </UiForm> -->
    <UiForm @submit="handleSubmit(onSubmit)">
      <TextField
        name="adaptation"
        label="Adaptation"
        v-model="form.adaptation"
        placeholder="Adaptation Details"
        helperText="Enter adaptation"
        required
      />
      <!-- Add more fields as needed -->
      <UiButton type="submit">Submit</UiButton>
    </UiForm>
  </Page>
</template>
<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { useForm } from "vee-validate";
  import { reactive } from "vue";
  import * as z from "zod";

  const validationSchema = toTypedSchema(
    z.object({
      adaptation: z.string().min(1, "Adaptation is required"),
      // Add more validation rules as needed
    }),
  );

  const form = reactive({
    adaptation: "",
  });

  const { handleSubmit, errors } = useForm({
    validationSchema,
    initialValues: form,
  });

  const onSubmit = (values: any) => {
    // Handle form submission
    console.log(values);
  };
</script>

<!-- <script setup lang="ts">
  import { textToSpeechValidation } from "~/validationSchema/textToSpeechValidation";

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
    validationSchema: toTypedSchema(textToSpeechValidation),
    initialValues: {
      adaptation: "",
    },
  });
  const handleTTlConfig = handleSubmit((value) => {
    console.log({ value });
  });
  watch(errors, (newError) => {
    console.log({ newError });
  });

  const adaptationValue = computed({
    get: () => values.adaptation as string,
    set: (value: string) => {
      if (values.adaptation !== undefined) {
        values.adaptation = value;
      }
    },
  });
  //   const [langauageField, langauageFieldAttrs] = defineField("language");
  const [adaptationField, adaptationFieldAttrs] = defineField("adaptation");
</script> -->
