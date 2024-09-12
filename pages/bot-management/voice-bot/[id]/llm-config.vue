<template>
  <Page
    title="LLM Configuration"
    :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/voice-bot/${botDetails.id}`,
      },
      {
        label: 'LLM Configuration',
        to: `/bot-management/voice-bot/${botDetails.id}/llm-config`,
      },
    ]"
    :disableSelector="true"
    :disable-back-button="false"
    :disable-elevation="false"
  >
    <div class="shadow-md mx-5 rounded-lg bg-white">
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
              <UiSelect v-bind="componentField">
                <UiSelectTrigger
                  class="hover:focus:none hover:focus-visible:none field_shadow h-12 w-full"
                >
                  <UiSelectValue placeholder="Select Role" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="({ value, label }, index) in roles"
                    :value="value"
                    >{{ label }}
                    <p class="text-xs italic text-gray-500">{{ value }}</p>
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
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
                placeholder="Include your company details along with the specifics of the service the bot will be providing"
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
              <UiTextarea
                v-bind="componentField"
                type="text"
                class="focus-visible:none h-14 focus-visible:ring-offset-0"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="notes">
          <UiFormItem v-auto-animate="animationProps">
            <UiFormLabel>Notes</UiFormLabel>
            <UiFormControl>
              <UiTextarea
                v-bind="componentField"
                type="text"
                class="focus-visible:none h-14 focus-visible:ring-offset-0"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="domainRules">
          <UiFormItem v-auto-animate="animationProps">
            <UiFormLabel>Domain Rules</UiFormLabel>
            <UiFormControl>
              <UiTextarea
                v-bind="componentField"
                type="text"
                class="focus-visible:none h-14 focus-visible:ring-offset-0"
              />
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
  </Page>
</template>
<script setup lang="ts">
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
      label: "Customer Support",
      value: "Assist customers with their questions and issues.",
    },
    {
      label: "Receptionist",
      value:
        "Assist customers queries about room bookings and hotel information",
    },
  ];

  const tokens = ["1024", "2048", "4096"];

  const animationProps = {
    duration: 0,
  };

  const defaultValues = {
    provider: provider[0].value,
    model: models[0].value,
    tokens: tokens[1],
    temperature: 0,
    documentId: "",
    role: roles[1].value,
    guide: "",
    instruction: "",
    notes: "",
    domainRules: "",
  };

  const router = useRouter();
  const route = useRoute("bot-management-voice-bot-id-llm-config");

  const botDetails: any = await getBotDetails(route.params.id);

  const handleLLMConfig = async (values: any) => {
    const payload: any = {
      provider: values.provider,
      model: values.model,
      tokens: values.tokens,
      temperature: values.temperature,
      documentId: values.documentId,
      role: values.role,
      guide: values.guide,
      instruction: values.instruction,
      notes: values.notes,
      domainRules: values.domainRules,
    };
    await updateLLMConfig(payload, botDetails.id);
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetails.id },
    });
  };
</script>
