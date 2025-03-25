<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import { cloudTelephonySchema } from '~/validationSchema/settings/cloudTelephonyValidatoin';
const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, any>;
  disabled: Record<boolean, any>;
  intentOptions: Record<string, any>;
}>();

const emit = defineEmits(["update:values"]);
const { value: provideraccountname } = useField("provideraccountname");
const { value: incomingPhoneNumber } = useField("incomingPhoneNumber");
// const { value: provider_stt } = useField("provider_stt");
// const { value: provider_tts } = useField("provider_tts");
// const { value: max_output_token } = useField("max_output_token");
// const { value: otherRole, errorMessage: otherRoleError } = useField("otherRole");
// const { value: otherGoal, errorMessage: otherGoalError } = useField("otherGoal");
// const { value: authId } = useField("authId");
// const { value: authToken } = useField("authToken");

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
])

const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
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
const onSelectProvider = async (value: any) => {
  await getNumberListApiCall(value);
};

const getNumberListApiCall = async (value: any) => {
  // Assuming getIntegratedProviderNumberList is defined elsewhere
  const getNumberList: any = await getIntegratedProviderNumberList(value);
  // Create array with "New Account" always as an option
  numberList.value = [
    { label: "New Account", value: "New Account" },
    ...getNumberList.map((item: any) => ({
      label: item,
      value: item
    }))
  ];
};

// Handle account selection
const onSelectAccount = (value: any) => {
  selectedAccount.value = value;
  showAuthFields.value = value === 'New Account';
  
  // If New Account is selected, clear auth fields
  if (value === 'New Account') {
    
  }
  
  emit("update:values", {
    ...props.values,
    provideraccountname: value,
    showAuthFields: showAuthFields.value
  });
};

// Handle auth information update
const onUpdateAuth = () => {
  emit("update:values", {
    ...props.values,
    // authId: authId.value,
    // authToken: authToken.value
  });
};

// Handle form submission
// const handleSubmit = () => {
//   // Emit updated values
//   emit("update:values", {
//     ...props.values,
//     authId: authId.value,
//     authToken: authToken.value,
//     provideraccountname: selectedAccount.value
//   });
// };
const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true
  const { provider, ...metadata } = values
  const payload = {
    provider,
    metadata,
  }
  try {
      await $fetch("/api/org/integrations/number-integration", { method: "POST", body: payload });
      toast.success("Integration added successfully");
  } catch(error: any) {
    isLoading.value = false
    toast.error(error.data.statusMessage)
  }
  isLoading.value = false
});

</script>

<template>
  <BotSetupCard
    title="Telephone Setup"
    description="Set up your IVR system to handle calls automatically and direct callers to the right place"
    currentStep="6"
    totalSteps="6">
    <div>
      <div class="grid grid-cols-2 gap-4">
        <SelectField 
          v-model="provideraccountname"
          name="provideraccountname" 
          label="Select Account Name" 
          :closeIcon="false" 
          :options="numberList" 
          placeholder="Select Account"
          @input="onSelectAccount($event)"
        />
        <!-- Integration Number -->
        <SelectField  v-model="incomingPhoneNumber"
          name="incomingPhoneNumber" 
          label="Integration Number" 
          :closeIcon="true"
          @input="onSelectProvider($event)" 
          :options="integrationsData"
          placeholder="Select Number"
          :disabled="numberList.length === 1" 
        />
        <!-- <SelectField 
          name="ivrConfig" 
          label="Cloud Telephone Provider" 
          :closeIcon="true"
          @input="onSelectProvider($event)" 
          :options="integrationsData"
          placeholder="Assign a Cloud Telephony provider to the bot." 
        /> -->
        
      </div>
      <!-- Auth fields - shown when New Account is selected -->
      <div v-if="showAuthFields" class="mt-6 ">
        <div class="p-0 rounded-md space-y-6  ">
          <!-- <p class="text-sm text-gray-600 mb-3">
            Note:
            <span class="block">Fill and submit the information to link the account</span>
          </p> -->
          <div class="bg-[#E2E8F0] rounded-lg p-4 text-[12px] md:text-[14px] text-left">
            <div class="font-medium">Note:</div>
            <div>
              Fill and submit the information to link the account
            </div>
          </div>
          <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
      <Form @submit="handleConnect" class="space-y-3">
        <div class='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-2'>
        <SelectField name="provider" placeholder="Select a provider" label="Cloud Telephone Provider" :options="providerList">
        </SelectField>
        <div class="flex flex-col gap-2 pt-[10px]">
          <TextField
              name="providername" label="Provider Account Name" placeholder="Enter provider account name" />
        </div>
        <!-- <div class="flex flex-col gap-2 pt-[10px]"> -->
          <TextField v-if="values.provider === 'plivo'" name="authId" label="Auth ID" placeholder="Enter auth ID" />
        <!-- </div> -->
          
        <TextField v-if="values.provider === 'plivo'" name="authToken" label="Auth Token" placeholder="Enter auth token" />
        <!-- <div class="flex flex-col gap-2 pt-[10px]" > -->
        <TextField v-if="values.provider === 'twilio' || values.provider === 'exotel'" name="accountSid"
          label="Account SID" placeholder="Enter account SID" />
        <!-- </div> -->
        <!-- <TextField v-if="values.provider === 'twilio'" name="authToken" label="Auth Token" required
          placeholder="Enter auth token" /> -->
        <TextField v-if="values.provider === 'twilio'" name="apiSecret" label="Api Secret"
          placeholder="Enter api secret" />

        <!-- Exotel -->
        <TextField v-if="values.provider === 'exotel'" name="subDomain" label="Sub Domain"
          placeholder="Enter sub domain" />
        <!-- <div :class="[(values.provider === 'telnyx') ? 'flex flex-col gap-2 pt-[10px]' : '']"> -->
          <TextField v-if="values.provider === 'twilio' || values.provider === 'exotel' || values.provider === 'telnyx'"
            name="apiKey" label="Api Key" placeholder="Enter Api Key" />
        <!-- </div> -->
        <TextField v-if="values.provider === 'exotel'" name="apiToken" label="Api Token"
          placeholder="Enter api token" />
        <TextField v-if="values.provider === 'exotel'" name="flowId" label="flow Id"
          placeholder="Enter flow Id" />
        <TextField v-if="values.provider === 'telnyx'" name="publicKey" label="public key"
          placeholder="Enter Public Key" />
        <TextField v-if="values.provider === 'telnyx'" name="connectionId" label="connection Id"
          placeholder="Enter Connection Id" />
      </div>
      <div class="flex w-full">
        <UiButton type="submit" class="mt-2" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </Form>
      </div>
    </div>
  </div>
  </BotSetupCard>
</template>