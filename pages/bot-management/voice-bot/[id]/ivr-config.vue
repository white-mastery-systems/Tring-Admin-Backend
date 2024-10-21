<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const formSchema = toTypedSchema(
  z.object({
    ivrConfig: z.string({ required_error: 'Number is required' }).min(1, 'Number is required'),
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
const route = useRoute("bot-management-voice-bot-id-ivr-config");
const botDetails: any = await getVoiceBotDetails(route.params.id);

const { data: botData, status: botLoadingStatus } = await useLazyFetch(`/api/voicebots/${route.params.id}`);

const {
  data: integrationsData,
  status,
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

const roles = ['Customer Support', 'Receptionist']
const domainList = ['Admin', 'User', 'Editor', 'Viewer', 'Contributor', 'Manager'];
const isLoading = ref(false)

watchEffect(() => {
  if (botDetails) {
    const userName = botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName} - IVR Config`,
    });
  }
});
watch(botData, (newValue) => {
  resetForm();
  setFieldValue("ivrConfig", botData.value.ivrConfig);
})


const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true;
  try {
    await updateLLMConfig(value, botDetails.id);
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
<template>
  <Page title="IVR Configuration" :bread-crumbs="[
    { label: `${botDetails.name}`, to: `/bot-management/voice-bot/${botDetails.id}` },
    {
      label: 'IVR Configuration',
      to: `/bot-management/voice-bot/${botDetails.id}/ivr-config`,
    },
  ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false">
    <div>
      <form @submit="onSubmit">
        <div class="flex grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <!-- <TextField name="provider" label="IVR Provider" placeholder="Enter Provider" helperText="" required>
          </TextField>
          <TextField name="number" label="Number" placeholder="Enter Number" helperText="" required>
          </TextField>
          <TextField name="calldirection" label="call direction" placeholder="Enter call direction" helperText=""
            required>
          </TextField> -->
          <SelectField name="ivrConfig" label="Phone Number" :options="integrationsData"
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
