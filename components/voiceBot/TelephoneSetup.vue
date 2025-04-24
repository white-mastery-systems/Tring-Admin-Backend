<template>
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
        <UiButton color="primary" type="submit" size="lg" :loading="isLoading" :disabled="!formHasChanged">
          {{ formHasChanged ? 'Submit' : 'No Changes' }}
        </UiButton>
      </div>
    </form>
  </div>
  <!-- </Page> -->
</template>
<script setup lang="ts">
import { useNumberIntegration } from "@/composables/botManagement/voiceBot/useNumberIntegration"

definePageMeta({
  middleware: "admin-only",
});

const props = defineProps<{ botDetails: any; loading: boolean; refreshBot: () => void }>();
const numberList = ref([])
const originalValues = ref({});

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

watch(() => props.botDetails, (newBotDetails) => {
  if (newBotDetails) {
    // Set form values
    setFieldValue("ivrConfig", newBotDetails.ivrConfig ?? "");
    setFieldValue("incomingPhoneNumber", newBotDetails.incomingPhoneNumber ?? "");
    
    // Store original values after form is populated
    nextTick(() => {
      originalValues.value = {
        ivrConfig: values.ivrConfig || "",
        incomingPhoneNumber: values.incomingPhoneNumber || ""
      };
    });
  }
}, { deep: true, immediate: true });


watch(() => values.ivrConfig, (selectedIvrConfig) => {
  const { status, numberIntegrationData, refresh } = useNumberIntegration(selectedIvrConfig);
  watch(() => numberIntegrationData.value, (newIntegrationsData) => {
    console.log(newIntegrationsData, "newIntegrationsData -- newIntegrationsData")
    if (newIntegrationsData) {
      console.log(newIntegrationsData, "newIntegrationsData -- newIntegrationsData")
      setFieldValue("cloudTelephoneProvider", newIntegrationsData?.provider ?? "")
      setFieldValue("authId", newIntegrationsData?.metadata?.authId ?? "")
      setFieldValue("authToken", newIntegrationsData.metadata?.authToken ?? "")
      setFieldValue("accountSID", newIntegrationsData.metadata?.accountSid ?? "")
      setFieldValue("apiSecret", newIntegrationsData.metadata?.apiSecret ?? "")
      setFieldValue("apiKey", newIntegrationsData.metadata?.apiKey ?? "")
      setFieldValue("apiToken", newIntegrationsData.metadata?.apiToken ?? "")
      setFieldValue("flowId", newIntegrationsData.metadata?.flowId ?? "")
      setFieldValue("publicKey", newIntegrationsData.metadata?.publicKey ?? "")
      setFieldValue("connectionId", newIntegrationsData.metadata?.connectionId ?? "")
      setFieldValue("subDomain", newIntegrationsData.metadata?.subDomain ?? "")
    }
  })
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

const hasFormChanged = () => {
  // Skip comparison if no original values are set yet
  if (Object.keys(originalValues.value).length === 0) return false;
  
  const fieldsToCheck = ["ivrConfig", "incomingPhoneNumber"];
  
  for (const field of fieldsToCheck) {
    const originalValue = String(originalValues.value[field] || "");
    const currentValue = String(values[field] || "");
    
    if (originalValue !== currentValue) {
      return true;
    }
  }
  
  return false;
};

// Computed property for template binding
const formHasChanged = computed(() => hasFormChanged());

const onSelectProvider = async (value: any) => {
  if (value) {
    await getNumberListApiCall(value)
  }
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
  
  // Only proceed if there are actual changes
  if (hasFormChanged()) {
    const payload = value.ivrConfig
      ? {
        ivrConfig: value.ivrConfig,
        incomingPhoneNumber: value.incomingPhoneNumber,
      }
      : { ivrConfig: null, incomingPhoneNumber: null };
    try {
      await updateLLMConfig(payload, props.botDetails.id, "The IVR Configuration has been added successfully.");
      
      // Update original values after successful save
      nextTick(() => {
        originalValues.value = {
          ivrConfig: values.ivrConfig || "",
          incomingPhoneNumber: values.incomingPhoneNumber || ""
        };
      });
      
      isLoading.value = false;
      return navigateTo({
        name: "voice-bot-id",
        params: { id: props.botDetails.id },
      });
    } catch (error: any) {
      toast.error(error.statusMessage)
      isLoading.value = false;
    }
  } else {
    console.log('No changes detected, skipping API call');
    isLoading.value = false;
  }
  isLoading.value = false;
});
</script>
