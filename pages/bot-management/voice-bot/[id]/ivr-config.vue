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
          <SelectField name="ivrConfig" label="Phone Number" :closeIcon="true" @input="onSelectProvider($event)"
            :options="integrationsData" placeholder="Assign a phone number to the bot." />
          <SelectField name="incomingPhoneNumber" label="Integrated Number" :closeIcon="true" :options="numberList"
            placeholder="Assign a integrated number to the bot." />
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
const numberList = ref([])
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
        label: `${item.provider}`
    }))
  },
});

const isLoading = ref(false)

const formSchema = toTypedSchema(
  z.object({
    ivrConfig: z.string().nonempty("IVR Configuration is required."),
    incomingPhoneNumber: z.string().nonempty("Incoming Phone Number is required."),
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
setFieldValue("incomingPhoneNumber", botDetails.incomingPhoneNumber ?? "")

const isPageLoading = computed(() =>  integrationsDataStatus.value === "pending")


// Watch for changes in the loading status or integrationsData
watch([isPageLoading, integrationsData], () => {
  // If the page is no longer loading and data is successfully fetched
  if (!isPageLoading.value) {
    // Check if integrationsData is empty after successful data load
    if (integrationsData.value.length === 0) {
      // If data is empty, show an error toast and navigate to the integration settings page
      toast.error("Please add a cloud telephone integration first");

      // Navigate to the settings integration page
      return navigateTo({
        name: "settings-integration",
        query: { q: 'number' }
      });
    } else {
      // Handle successful data load case
      console.log('Data loaded successfully')
    }
  }
});
onMounted(async () => {
  if (values.ivrConfig) {
    await getNumberListApiCall(values.ivrConfig)
  }
});

const onSelectProvider = async (value: any) => {
 await getNumberListApiCall(value)
}

const getNumberListApiCall = async (value: any) => {
  const getNumberList: any = await getIntegratedProviderNumberList(value)
  numberList.value = getNumberList.map((item: any) => ({
    label: item,
    value: item
  }))
}


const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true;
  const payload = value.ivrConfig
    ? {
      ivrConfig: value.ivrConfig,
      incomingPhoneNumber: value.incomingPhoneNumber,
    }
    : null
  try {
    await updateLLMConfig(payload, botDetails.id, "The IVR Configuration has been added successfully.");
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: botDetails.id },
    });
  } catch (error: any) {
    toast.error(error.statusMessage)
    // console.error("An error occurred while updating:", error);
  } finally {
    isLoading.value = false;
  }
});

</script>
