<template>
  <Page title="LLM Configuration" :bread-crumbs="[
      {
        label: `${botDetails.name}`,
        to: `/bot-management/voice-bot/${botDetails.id}`,
      },
      {
        label: 'LLM Configuration',
        to: `/bot-management/voice-bot/${botDetails.id}/llm-config`,
      },
    ]" :disableSelector="true" :disable-back-button="false" :disable-elevation="false">
    <div class="shadow-md mx-5 rounded-lg ">
      <form @submit.prevent="handleLLMConfigSubmit">
        <div class="grid w-full grid-cols-2 gap-2">
          <!-- <SelectField name="provider" label="Provider" placeholder="Select Provider" :options="provider" required />

          <SelectField name="model" label="Model" placeholder="Select Model" :options="models" required /> -->

          <SelectField name="tokens" label="Max Tokens" placeholder="Max Tokens"
            :options="tokens.map((token) => ({ label: token, value: token }))" :required="true" />

          <div class="mt-5 flex flex-col gap-2">
            <RangeSlider :step="0.1" :name="values.temperature" label="Temperature" @update="
                ($event) => {
                  setFieldValue('temperature', $event);
                }
              " required placeholder="Enter speaking Rate" min="0" max="1" />
          </div>
        </div>
        <div class="spcace-y-2 grid w-full grid-cols-2 gap-2">
          <TextField name="top_k" label="Top K" required placeholder="Enter Top K" />
          <TextField name="top_p" label="Top P" required placeholder="Enter Top P" />
        </div>
        <div class="spcace-y-2 grid w-full grid-cols-1 gap-2">
          <!-- <TextField   label="Document Id" name="documentId" 
          placeholder="Document Id"  /> -->
          <!-- <SelectField name="role" label="Role" placeholder="Role is required" :options="roles" :required="true" /> -->
          <TextField label="System Prompt" name="prompt" placeholder="Enter prompt" :isTextarea="true" required />
          <!-- <TextField label="Additional Instructions" name="instruction"
            placeholder="Include your company details along with the specifics of the service the bot will be providing"
            :isTextarea="true" />
          <TextField label="Notes" name="notes" placeholder="Notes the data" :isTextarea="true" />
          <TextField label="Domain Rules" name="domainRules" placeholder="Domain Rules" :isTextarea="true" /> -->
          <!-- <TextField label="Domain Rules" name="domainRules" placeholder="Domain Rules" :isTextarea="true" /> -->
        </div>
        <div class="flex items-center justify-end mt-4">
          <UiButton type="submit" color="primary" :loading="isLoading">
            Submit
          </UiButton>
        </div>
        <!-- copy paste the class  below-->
        <!-- class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium" -->
      </form>
    </div>
  </Page>
</template>
<script setup lang="ts">
  import { llmConfigurationValidation } from "~/validationSchema/botManagement/LLmConfigurationValidation";
  
  const router = useRouter();
  const route = useRoute("bot-management-voice-bot-id-llm-config");
  const isLoading = ref(false)
  // import { lLmConfigurationValidation } from "~/validationSchema/botManagement/llmConfigurationValidation";

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
    {
      label: "Perform other custom tasks as needed.",
      value: "Other",
    },
  ];

  const tokens = ["1024", "2048", "4096"];

  const botDetails: any = await getVoiceBotDetails(route.params.id);
  
  watchEffect(() => {
    if (botDetails) {
      const userName = botDetails?.name ?? "Unknown Bot Name";
      useHead({
        title: `Voice Bot | ${userName} - LLM Config`,
      });
    }
  });

  const {
    setFieldValue,
    handleSubmit,
    errors,
    values,
    defineField,
    resetForm,
  } = useForm({
    validationSchema: llmConfigurationValidation,
  });
  Object.entries(botDetails.llmConfig).forEach(([key, value]: any) => {
    if (values.hasOwnProperty(key)) {
      setFieldValue(key, value);
    }
  });

  const handleLLMConfigSubmit = handleSubmit(async (value: any) => {
    isLoading.value = true
    await updateLLMConfig({ llmConfig: value }, botDetails.id, "The LLM configuration has been added successfully.");
    isLoading.value = false
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetails.id },
    });
  });

  // const handleLLMConfig = async (values: any) => {
  //   const payload: any = {
  //     provider: values.provider,
  //     model: values.model,
  //     tokens: values.tokens,
  //     temperature: values.temperature,
  //     documentId: values.documentId,
  //     role: values.role,
  //     guide: values.guide,
  //     instruction: values.instruction,
  //     notes: values.notes,
  //     domainRules: values.domainRules,
  //   };

  // };
</script>
