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
      <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
        <div class="flex grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
          <TextField name="agentName" label="Agent Name" required placeholder="Enter agent name" />
          <SelectField name="agentLanguage" :options="languageList" label="Agent Language" placeholder="Agent Language"
            helperText="Select your language." required></SelectField>
          <RegionISOCodeSelect name="region" label="Region" helperText="Enter your region" required />
          <CountryTimeZones name="timezone" label="Time Zones" helperText="Enter your time zones" required />
          <!-- {{ formattedTimeZones }} -->
          <!-- <UiFormField v-slot="{ value, handleChange }" name="backgroundSoundControler">
            <UiFormItem class="w-[49%]">
              <div class="flex justify-between">
                <UiLabel class="text-[14px] font-medium">Background Sound Controller</UiLabel>
                <UiFormControl>
                  <UiSwitch id="backgroundSoundControler" :checked="value" @update:checked="(checked) => {
                    handleChange(checked);
                  }" :style="{ background: value ? '#424BD1' : '#8A8A8A' }" />
                </UiFormControl>
                <UiFormMessage />
              </div>
            </UiFormItem>
          </UiFormField>
          <SelectField name="backgroundSounds" :options="backgroundSoundList" label="Background Sounds"
            :disabled="!values.backgroundSoundControler" placeholder="Select Background Sound"
            helperText="Select your background sound." required></SelectField> -->
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
import { useVoiceLanguageList } from '~/composables/voiceBotLanguageList';
import { useTImeList } from '~/composables/timeZones';
 const config=useRuntimeConfig()
  definePageMeta({
    middleware: "admin-only",
  });
  const route = useRoute("voice-bot-id-identity-management");
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

  const { languageList } = useVoiceLanguageList();
  const { formattedTimeZones } = useTImeList();
  const isLoading = ref(false);
  const botSchema = toTypedSchema(
    z.object({
      agentName: z
        .string({ required_error: "Agent Name is required" })
        .min(1, { message: "Agent Name is required" }),
      agentLanguage: z
        .string({ required_error: "Agent Language is required" })
        .min(1, { message: "Agent Language is required" }),
      region: z
        .string({ required_error: "Country is required" })
        .min(1, "Country is required"),
      timezone: z
        .string({ required_error: "Time zone is required" })
        .min(1, "Time zone is required"),
      // backgroundSoundControler: z.boolean().optional(),
      // backgroundSounds: z
      //   .string().optional()
    })
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
    const modifiedData = {
      agentName: value.agentName,
      agentLanguage: value.agentLanguage,
      region: value.region,
      timezone: value.timezone,
    }
    let payload = {
      botDetails: modifiedData,
    };

    await updateLLMConfig(payload, botDetailsList.id, "Bot information added successfully.");
    isLoading.value = false;

    return navigateTo({
      name: "voice-bot-id",
      params: { id: botDetailsList.id },
    });
  });

</script>
