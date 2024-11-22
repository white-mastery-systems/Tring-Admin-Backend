<template>
  <!-- :bread-crumbs="[
    { label: `${botDetailsList.name}`, to: `/bot-management/chat-bot/${botDetailsList.id}` },
    {
      label: 'Intent Management',
      to: `/bot-management/chat-bot/${botDetailsList.id}/intent-management`,
    },
  ]"  -->
  <Page title="Bot Details" :bread-crumbs="[
      {
        label: `${botDetailsList.name}`,
        to: `/bot-management/voice-bot/${botDetailsList.id}`,
      },
      {
        label: 'Bot Details',
        to: `/bot-management/voice-bot/${botDetailsList.id}/identity-management`,
      },
    ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div class="pb-2 sm:pb-0">
      <form @submit="onSubmit" class="flex flex-col gap-2">
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
          <TextField name="agentName" label="Agent Name" required placeholder="Enter agent name" />
          <SelectField name="agentLanguage" :options="languageList" label="Agent Language" placeholder="Agent Language"
            helperText="Select your language."></SelectField>
          <!-- <TextField name="agentLanguage" label="Agent Language" required placeholder="Enter agent language" /> -->
        </div>
        <div class="flex w-full justify-end">
          <UiButton type="submit" class="w-[120px] self-end bg-[#424bd1] hover:bg-[#424bd1] hover:brightness-110"
            size="lg" :loading="isLoading">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { useLanguageList } from '~/composables/voiceBotLanguageList';
 const config=useRuntimeConfig()
  definePageMeta({
    middleware: "admin-only",
  });
  const route = useRoute("bot-management-voice-bot-id-identity-management");
  const botDetailsList: any = await getVoiceBotDetails(route.params.id);
  const welcomeFilesData = ref([]);
  const concludeFilesData = ref([]);
  const deleteFileBucket = ref([ ]);


  const roles = [
    {
      value: "Customer Support",
      label: "Customer Support",
      helperText: "Assist customers with their questions and issues.",
    },
    {
      value: "Receptionist",
      label: "Receptionist",
      helperText: "Handles visitor interactions and phone calls.",
    },
  ];

  const { languageList } = useLanguageList();
  const domainList = [
    { value: "Customer Support", label: "Customer Support" },
    { value: "Sales Assistant", label: "Sales Assistant" },
    { value: "Technical Support", label: "Technical Support" },
    { value: "Lead Generation", label: "Lead Generation" },
    {
      value: "Survey Taker",
      label: "Survey Taker",
      helperText: "Can contribute content but with limited permissions",
    },
    { value: "Appointment Scheduler", label: "Appointment Scheduler" },
    { value: "FAQ Bot", label: "FAQ Bot" },
    { value: "Others", label: "Others" },
  ];
  const isLoading = ref(false);

  const botSchema = toTypedSchema(
    z.object({
      agentName: z
        .string({ required_error: "Agent Name is required" })
        .min(1, { message: "Agent Name is required" }),
      agentLanguage: z
        .string({ required_error: "Agent Language is required" })
        .min(1, { message: "Agent Language is required" }),
    }),
  );
  const {
    setFieldValue,
    handleSubmit,
    errors,
    defineField,
    resetForm,
    values,
  } = useForm({
    validationSchema: botSchema,
    initialValues: {
      // name: "",
    },
  });

Object.entries(botDetailsList.botDetails ?? {}).forEach(([key, value]: any) => {
  if (values.hasOwnProperty(key)) {
    setFieldValue(key, value);
  }
});
  watchEffect(() => {
    if (botDetailsList) {
      const userName = botDetailsList?.name ?? "Unknown Bot Name";
      useHead({
        title: `Voice Bot | ${userName} - Identity Management`,
      });
    }
  });

  const onSubmit = handleSubmit(async (value: any) => {
    // updateLLMConfig()
    isLoading.value = true;
    let payload = {
      botDetails: value,
    };

    await updateLLMConfig(payload, botDetailsList.id, "Bot information added successfully.");
    isLoading.value = false;

    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetailsList.id },
    });
  });

</script>
