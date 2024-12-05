<template>
  <Page title="IVR Configuration" :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/voice-bot/${botDetails.id}` },
    {
      label: 'IVR Configuration',
      to: `/bot-management/voice-bot/${botDetails.id}/ivr-config`,
    },
  ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="flex grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <SelectField name="ivrConfig" label="Phone Number" :closeIcon="true" :options="integrationsData"
            placeholder="Assign a phone number to the bot." />
        </div>
        <div class="flex justify-end w-full">
          <UiButton type="submit" color="primary" size="lg" :loading="isLoading">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </Page>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const route = useRoute("bot-management-voice-bot-id-ivr-config");
const botDetails: any = await getVoiceBotDetails(route.params.id);

// const { data: botData, status: botLoadingStatus } = await useLazyFetch(`/api/voicebots/${route.params.id}`);

const {
  data: integrationsData,
  status: integrationsDataStatus,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations/number-integration", {
  server: false,
  default: () => [],
  transform: (number: any) => {
    return number.map((item: any) => ({
        value: item.id,
        label: `${item.provider} - ${item.countryCode}${item.exoPhone}`
    }))
  },
});

const isLoading = ref(false)

const formSchema = toTypedSchema(
  z.object({
    ivrConfig: z.string().optional(),
    // provider: z.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
    // number: z.string({ required_error: "Number must be provided." }).min(2, "Number must be provided."),
    // calldirection: z.string({ required_error: 'Call direction is required' }).min(1, 'Call direction is required'),
  })
)

const {
  errors,
  setErrors,
  handleSubmit,
  setFieldValue,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: formSchema
})
watchEffect(() => {
  if (botDetails) {
    const userName = botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName} - IVR Config`,
    });
  }
});
setFieldValue("ivrConfig", botDetails.ivrConfig ?? "")
// watch(botData, (newValue) => {
//   console.log(botData.value?.ivrConfig, "botData.value?.ivrConfig")
//   resetForm();
// })


const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true;
  try {
    await updateLLMConfig({ ivrConfig: (value.ivrConfig) ? value.ivrConfig : null }, botDetails.id, "The IVR Configuration has been added successfully.");
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetails.id },
    });
  } catch (error) {
    toast.error(error.statusMessage)
    // console.error("An error occurred while updating:", error);
  } finally {
    isLoading.value = false;
  }
});

</script>
