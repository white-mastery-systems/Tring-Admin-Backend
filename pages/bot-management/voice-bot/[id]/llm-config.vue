<template>
  <Page
    title="LLM Configuration"
    :bread-crumbs="[
      //   { label: `${botDetails.name}`, to: `/bots/${botDetails.id}` },
      //   {
      //     label: 'LLM Configuration',
      //     to: `/bots/${botDetails.id}/llm-config`,
      //   },
    ]"
    :disableSelector="true"
    :disable-back-button="false"
    :disable-elevation="true"
  >
  </Page>
  <div class="shadow- mx-5 rounded-lg bg-white">
    <UiForm
      v-slot="{ values, errors }"
     
      :keep-values="true"
      :validate-on-mount="false"
      :initial-values="defaultValues"
      class="space-y-2"
      @submit="handleLLMConfig"
    >
      <div class="flex gap-4">
        <UiFormField v-slot="{ componentField }" name="provider">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel> Provider </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger
                  class="hover:focus:none hover:focus-visible:none field_shadow h-12 w-full"
                >
                  <UiSelectValue placeholder="Select Provider" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="option in provider"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="model">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel>Model </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger
                  class="hover:focus:none hover:focus-visible:none field_shadow h-12 w-full"
                >
                  <UiSelectValue placeholder="Select Model" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="model in models"
                    :key="model.value"
                    :value="model.value"
                  >
                    {{ model.label }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <div class="flex gap-4">
        <UiFormField v-slot="{ componentField }" name="tokens">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel>Max Tokens </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger
                  class="hover:focus:none hover:focus-visible:none field_shadow h-12 w-full"
                >
                  <UiSelectValue placeholder="Select Max Tokens" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="token in tokens"
                    :key="token"
                    :value="token"
                    >{{ token }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="temperature">
          <UiFormItem v-auto-animate="animationProps" class="w-full">
            <UiFormLabel> Temperature </UiFormLabel>
            <UiFormControl>
              <UiNumberField
                :default-value="0"
                :step="0.1"
                :format-options="{
                  minimumFractionDigits: 1,
                }"
                :min="0"
                :max="1"
                v-bind="componentField"
                class="focus-visible:none h-12 focus-visible:ring-offset-0"
              >
                <UiNumberFieldContent>
                  <UiNumberFieldDecrement />
                  <UiNumberFieldInput />
                  <UiNumberFieldIncrement />
                </UiNumberFieldContent>
              </UiNumberField>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <UiFormField v-slot="{ componentField }" name="documentId">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Document Id</UiFormLabel>
          <UiFormControl>
            <UiInput
              v-bind="componentField"
              type="text"
              class="focus-visible:none h-12 focus-visible:ring-offset-0"
            />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField v-slot="{ componentField }" name="role">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Role</UiFormLabel>
          <UiFormControl>
            <UiInput
              v-bind="componentField"
              type="text"
              class="focus-visible:none h-12 focus-visible:ring-offset-0"
            />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField v-slot="{ componentField }" name="guide">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Guide</UiFormLabel>
          <UiFormControl>
            <UiTextarea
              v-bind="componentField"
              type="text"
              placeholder="guide for gpt goes here"
              class="focus-visible:none h-14 focus-visible:ring-offset-0"
            />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField v-slot="{ componentField }" name="instruction">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Additional Instructions</UiFormLabel>
          <UiFormControl>
            <UiTextarea v-bind="componentField" type="text" class="h-14" />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField v-slot="{ componentField }" name="notes">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Notes</UiFormLabel>
          <UiFormControl>
            <UiTextarea v-bind="componentField" type="text" class="h-14" />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField v-slot="{ componentField }" name="domainRules">
        <UiFormItem v-auto-animate="animationProps">
          <UiFormLabel>Domain Rules</UiFormLabel>
          <UiFormControl>
            <UiTextarea v-bind="componentField" type="text" class="h-14" />
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiButton
        type="submit"
        class="bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
        size="lg"
        >Submit</UiButton
      >
    </UiForm>
  </div>
</template>
<script setup lang="ts">
  import { z } from "zod";
  const provider = [
    {
      value: "openai",
      label: "OpenAI",
    },
    {
      value: "google",
      label: "Gemini",
    },
  ];

  const models = [
    {
      value: "gpt-4o-mini",
      label: "gpt-4o-mini",
    },
    {
      value: "gemini-1.5-flash",
      label: "gemini-1.5-flash",
    },
  ];

  const roles = [
    {
      label: "Assist customers with their questions and issues.",
      value: "Customer Support",
    },
    {
      label: "Assist customers queries about room bookings and hotel information",
      value: "Receptionist",
    }
  ]

  const tokens = ["1024", "2048", "4096"];

  const animationProps = {
    duration: 0,
  };

  const formSchema = z.object({
    provider: z.string().min(1, "Provider is required."),
    model: z.string().min(1, "Model is required."),
    tokens: z.string().min(1, "Max Tokens is required."),
    temperature: z
      .number()
      .min(0, "Temperature must be at least 0.")
      .max(1, "Temperature cannot exceed 1."),
    documentId: z.string().min(1, "Document Id is required."),
    role: z.string().min(1, "Role is required."),
    guide: z.string().optional().default(""),
    instruction: z.string().optional().default(""),
    notes: z.string().optional().default(""),
    domainRules: z.string().optional().default(""),
  });

  const defaultValues = {
    provider: provider[0].value,
    model: models[0].value,
    tokens: tokens[1],
    temperature: 0,
    documentId: "",
    role: "",
    guide: "",
    instruction: "",
    notes: "",
    domainRules: "",
  };

  const handleLLMConfig = async (values: any) => {
    console.log(values);
  };
</script>
