<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import { cloudTelephonySchema } from '~/validationSchema/settings/cloudTelephonyValidatoin';
import { useForm } from 'vee-validate';
import { useCount } from '@/composables/useRefresh';

const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, any>;
  disabled: Record<boolean, any>;
  intentOptions: Record<string, any>;
}>();
const isLoading = ref(false);
const emit = defineEmits(["update:values"]);
const { value: provideraccountname } = useField("provideraccountname");
const { value: incomingPhoneNumber } = useField("incomingPhoneNumber");
const { status, integrationsData, refresh,} = useCount();

// For account selection
const showAuthFields = ref(false);
const numberList = ref([{ label: "New Account", value: "New Account" }]);
const selectedAccount = ref('');
const providerList = ref([
  {
    value: 'sandbox',
    label: 'Sandbox',
  }, {
    value: 'twilio',
    label: 'Twilio',
  }, {
    value: 'exotel',
    label: 'Exotel',
  }, {
    value: 'telnyx',
    label: 'Telnyx',
  }, {
    value: 'plivo',
    label: 'Plivo',
  }
]);

const {
  handleSubmit,
  values: telephoneSetupValues,
  resetForm,
} = useForm({
  validationSchema: cloudTelephonySchema,
});
// Watch for role selection changes
watch([provideraccountname, incomingPhoneNumber], () => {
  emit("update:values", {
    ...props.values,
    provideraccountname: provideraccountname.value,
    incomingPhoneNumber: incomingPhoneNumber.value
  })
});

/**
 * A function that will be called whenever a provider is selected in the ivrConfig dropdown.
 * It will call the getNumberListApiCall function to get the integrated numbers associated with the selected provider.
 * @param {String} value The value of the selected provider
 * @returns {Promise<void>}
 */

// Handle account selection
const onSelectAccount = async (value: any) => {
 console.log(value, 'value -- value');
  
  if (value === 'New Account') {
    selectedAccount.value = value;
    showAuthFields.value = true;
  } else if (value) {
    selectedAccount.value = '';
    showAuthFields.value = false;
    await getNumberListApiCall(value);
  }
  
  emit("update:values", {
    ...props.values,
    provideraccountname: value,
    showAuthFields: showAuthFields.value
  });
};
const getNumberListApiCall = async (value: any) => {
  // Assuming getIntegratedProviderNumberList is defined elsewhere
  // const getNumberList: any = await getIntegratedProviderNumberList(value);
  // Create array with "New Account" always as an option
  const getNumberList: any = await getIntegratedProviderNumberList(value)
  numberList.value = getNumberList?.map((item: any) => ({
    label: item,
    value: item
  }))
};

const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true
  const { provider, ...metadata } = values
  const payload = {
    ivrIntegrationName: values.ivrIntegrationName,
    provider,
    metadata,
  }
  try {
      await $fetch("/api/org/integrations/number-integration", { method: "POST", body: payload });
      toast.success("Integration added successfully");
      setTimeout(() => {
        resetForm()
      }, 2000);
    } catch(error: any) {
      isLoading.value = false
      toast.error(error.data.statusMessage)
    }
    isLoading.value = false
    await refresh()
});

</script>

<template>
  <BotSetupCard title="Telephone Setup"
    description="Set up your IVR system to handle calls automatically and direct callers to the right place"
    currentStep="6" totalSteps="6">
    <div>
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField v-model="provideraccountname" name="provideraccountname" label="Select Account Name"
          :closeIcon="false" :options="[
              { label: 'New Account', value: 'New Account' },
              ...integrationsData.map((item: any) => {
                return {
                  label: `${item.ivrIntegrationName}`,
                  value: item.id,
                }
              })
            ]" placeholder="Select Account" @input="onSelectAccount($event)" />
        <!-- Integration Number -->
        <SelectField v-model="incomingPhoneNumber" name="incomingPhoneNumber" label="Integration Number"
          :closeIcon="true" :options="numberList" placeholder="Select Number"
          :disabled="numberList?.length === 0 || (numberList[0]?.value === 'New Account') || props.values.provideraccountname === 'New Account'" @input="onSelectNumber($event)"/>
      </div>
      <!-- Auth fields - shown when New Account is selected -->
      <div v-if="showAuthFields" class="mt-6 ">
        <div class="p-0 rounded-md space-y-6  ">
          <div class="bg-[#E2E8F0] rounded-lg p-4 text-[12px] md:text-[14px] text-left">
            <div class="font-medium">Note:</div>
            <div>
              Fill and submit the information to link the account
            </div>
          </div>
          <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
          <Form @submit.prevent="handleConnect" class="space-y-3">
            <div class='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-2'>
              <SelectField name="provider" placeholder="Select a provider" label="Cloud Telephone Provider"
                :options="providerList">
              </SelectField>
                <TextField name="ivrIntegrationName" label="Provider Account Name"
                  placeholder="Enter provider account name" />
              <TextField v-if="telephoneSetupValues.provider === 'plivo'" name="authId" label="Auth ID" placeholder="Enter auth ID" />

              <TextField v-if="telephoneSetupValues.provider === 'plivo'" name="authToken" label="Auth Token"
                placeholder="Enter auth token" />
              <TextField v-if="telephoneSetupValues.provider === 'twilio' || telephoneSetupValues.provider === 'exotel'" name="accountSid"
                label="Account SID" placeholder="Enter account SID" />
              <TextField v-if="telephoneSetupValues.provider === 'twilio'" name="apiSecret" label="Api Secret"
                placeholder="Enter api secret" />

              <!-- Exotel -->
              <TextField v-if="telephoneSetupValues.provider === 'exotel'" name="subDomain" label="Sub Domain"
                placeholder="Enter sub domain" />
              <TextField
                v-if="telephoneSetupValues.provider === 'twilio' || telephoneSetupValues.provider === 'exotel' || telephoneSetupValues.provider === 'telnyx'"
                name="apiKey" label="Api Key" placeholder="Enter Api Key" />
              <TextField v-if="telephoneSetupValues.provider === 'exotel'" name="apiToken" label="Api Token"
                placeholder="Enter api token" />
              <TextField v-if="telephoneSetupValues.provider === 'exotel'" name="flowId" label="flow Id"
                placeholder="Enter flow Id" />
              <TextField v-if="telephoneSetupValues.provider === 'telnyx'" name="publicKey" label="public key"
                placeholder="Enter Public Key" />
              <TextField v-if="telephoneSetupValues.provider === 'telnyx'" name="connectionId" label="connection Id"
                placeholder="Enter Connection Id" />
            </div>
            <div class="flex w-full">
              <UiButton color="primary" type="submit" class="mt-2 px-4" :loading="isLoading">
                Submit
              </UiButton>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </BotSetupCard>
</template>