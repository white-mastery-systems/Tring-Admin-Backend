<template>
  <!-- <Page title="IVR Configuration" :bread-crumbs="[

  ]" :disableSelector="true" :disable-back-button="false" :disableElevation="false"> -->
  <div>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="flex grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <SelectField name="ivrConfig" label="Provider Account" :closeIcon="true" @input="onSelectProvider($event)"
          :options="integrationsData" placeholder="Assign a Cloud Telephony provider to the bot." />
        <SelectField name="incomingPhoneNumber" label="Integrated Number" :closeIcon="false" :options="numberList"
          placeholder="Assign a integrated number to the bot." />
      </div>
      <div class="flex grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
        v-if="values.cloudTelephoneProvider">
        <TextField name="cloudTelephoneProvider" placeholder="" label="Cloud Telephone Provider" :disabled="true"
          class="bg-[#E4E4E7] text-[#71717A]">
        </TextField>
        <TextField v-show="values.cloudTelephoneProvider === 'plivo'" name="authId" placeholder="" label="Auth ID"
          :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
        </TextField>
        <TextField v-show="values.cloudTelephoneProvider === 'plivo'" name="authToken" placeholder="" label="Auth Token"
          :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
        </TextField>
        <!-- Twilio -->
        <!-- <TextField v-show="values.cloudTelephoneProvider === 'plivo'" name="authToken" placeholder="" label="Auth Token"
          :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
        </TextField> -->
        <TextField v-show="values.cloudTelephoneProvider === 'twilio' || values.cloudTelephoneProvider === 'exotel'"
          name="accountSID" placeholder="" label="Account SID" :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
        </TextField>
        <TextField v-show="values.cloudTelephoneProvider === 'twilio'" name="apiSecret" placeholder=""
          label="Api Secret" :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
        </TextField>
        <TextField
          v-show="values.cloudTelephoneProvider === 'twilio' || values.cloudTelephoneProvider === 'exotel' || values.cloudTelephoneProvider === 'telnyx'"
          name="apiKey" placeholder="" label="Api Key" :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
        </TextField>
        <TextField v-show="values.cloudTelephoneProvider === 'exotel'" name="apiToken" placeholder="Api token"
        label="Api Token" :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
      </TextField>
      <TextField v-show="values.cloudTelephoneProvider === 'exotel'" name="flowId" placeholder="Flow id"
      label="flow Id" :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
    </TextField>
    <TextField v-show="values.cloudTelephoneProvider === 'telnyx'" name="publicKey" placeholder="Public key"
    label="Public Key" :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
  </TextField>
  <TextField v-show="values.cloudTelephoneProvider === 'exotel'" name="subDomain" placeholder="Sub domain"
    label="Sub Domain" :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
  </TextField>
        <TextField v-show="values.cloudTelephoneProvider === 'telnyx'" name="connectionId" placeholder="Connection id"
          label="Connection Id" :disabled="true" class="bg-[#E4E4E7] text-[#71717A]">
        </TextField>
      </div>
      <div class="flex justify-end w-full">
        <UiButton type="submit" size="lg" class="bg-[#DEDEDE] hover:bg-[#DEDEDE]" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </div>
  <!-- </Page> -->
</template>
<script setup lang="ts">
import { useBreadcrumbStore } from "~/store/breadcrumbs"; // Import the store
import { useNumberIntegration } from "@/composables/botManagement/voiceBot/useNumberIntegration"

definePageMeta({
  middleware: "admin-only",
});

const route = useRoute("voice-bot-id-ivr-config");
// const botDetails: any = await getVoiceBotDetails(route.params.id);
const props = defineProps<{ botDetails: any; loading: boolean; refreshBot: () => void }>();
const numberList = ref([])
const breadcrumbStore = useBreadcrumbStore();

breadcrumbStore.setBreadcrumbs([
  {
    label: 'IVR Configuration',
    to: `/voice-bot/${props.botDetails.id}` 
  },
  { label: `${props.botDetails.name}`, 
    to: `/voice-bot/${props.botDetails.id}/ivr-config`,
  },
]);
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
    ivrConfig: z.string().optional(),
    incomingPhoneNumber: z.string().optional(),
    cloudTelephoneProvider: z.string().optional(),
    authId: z.string().optional(),  
    authToken: z.string().optional(),
    accountSID: z.string().optional(),
    apiSecret: z.string().optional(),
    apiKey: z.string().optional(),
    apiToken: z.string().optional(),
    flowId: z.string().optional(),
    publicKey: z.string().optional(),
    connectionId: z.string().optional(),
    subDomain: z.string().optional(),
    // phoneNumber: z.string().optional(),
    // phoneId: z.string().optional(),
    // projectId: z.string().optional(),
    // workspaceId: z.string().optional(),
    // workspaceSid: z.string().optional(),
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
  if (props.botDetails) {
    const userName = props.botDetails?.name ?? 'Unknown Bot Name';
    useHead({
      title: `Voice Bot | ${userName} - IVR Config`,
    });
  }
});
setFieldValue("ivrConfig", props.botDetails.ivrConfig ?? "")
setFieldValue("incomingPhoneNumber", props.botDetails.incomingPhoneNumber ?? "")

const isPageLoading = computed(() =>  integrationsDataStatus.value === "pending")

watch(() => values.ivrConfig, (selectedIvrConfig) => {
  const { status, numberIntegrationData, refresh } = useNumberIntegration(selectedIvrConfig);
  watch(() => numberIntegrationData.value, (newIntegrationsData) => {
    console.log(newIntegrationsData, "newIntegrationsData -- newIntegrationsData")
    if (newIntegrationsData) {
      console.log(newIntegrationsData, "newIntegrationsData -- newIntegrationsData")
      setFieldValue("cloudTelephoneProvider", newIntegrationsData?.provider ?? "")
      setFieldValue("authId", newIntegrationsData.metadata.authId ?? "")
      setFieldValue("authToken", newIntegrationsData.metadata.authToken ?? "")
      setFieldValue("accountSID", newIntegrationsData.metadata.accountSid ?? "")
      setFieldValue("apiSecret", newIntegrationsData.metadata.apiSecret ?? "")
      setFieldValue("apiKey", newIntegrationsData.metadata.apiKey ?? "")
      setFieldValue("apiToken", newIntegrationsData.metadata.apiToken ?? "")
      setFieldValue("flowId", newIntegrationsData.metadata.flowId ?? "")
      setFieldValue("publicKey", newIntegrationsData.metadata.publicKey ?? "")
      setFieldValue("connectionId", newIntegrationsData.metadata.connectionId ?? "")
      setFieldValue("subDomain", newIntegrationsData.metadata.subDomain ?? "")
      // setFieldValue("phoneNumber", newIntegrationsData.metadata.phoneNumber ?? "")
      // setFieldValue("phoneId", newIntegrationsData.metadata.phoneId ?? "")
      // setFieldValue("projectId", newIntegrationsData.metadata.projectId ?? "")
      // setFieldValue("workspaceId", newIntegrationsData.metadata.workspaceId ?? "")
      // setFieldValue("workspaceSid", newIntegrationsData.metadata.workspaceSid ?? "")
    }
  })
  // setFieldValue("cloudTelephoneProvider", numberIntegrationData.value.provider ?? "")
})
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
        name: " integration",
        query: { q: 'number' }
      });
    }
  }
});
onMounted(async () => {
  if (values.ivrConfig) {
    await getNumberListApiCall(values.ivrConfig)
  }
});

watch(() => values.ivrConfig, () => {
  setFieldValue("incomingPhoneNumber", "")
})

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
    : { ivrConfig: null, incomingPhoneNumber: null };
  try {
    await updateLLMConfig(payload, props.botDetails.id, "The IVR Configuration has been added successfully.");
    return navigateTo({
      name: "voice-bot-id",
      params: { id: props.botDetails.id },
    });
  } catch (error: any) {
    toast.error(error.statusMessage)
    // console.error("An error occurred while updating:", error);
  } finally {
    isLoading.value = false;
  }
});

</script>
