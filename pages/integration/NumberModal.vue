<template>
  <DialogWrapper v-model="props.numberModalState"
    :title="(numberModalState.id) ? 'Edit Cloud Telephony' : 'Add New Cloud Telephony'">
    <Form @submit="handleConnect" class="space-y-3">
      <SelectField name="provider" placeholder="Select a provider" :options="providerList">
      </SelectField>
      <div class='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-2 xl:grid-cols-2'>
        <TextField v-if="values.provider" name="ivrIntegrationName" placeholder="Enter Integration Name" required
          label="Cloud Telephone Provider">
        </TextField>
        <TextField v-if="values.provider === 'plivo'" name="authId" label="Auth ID" required
          placeholder="Enter auth ID" />

        <TextField v-if="values.provider === 'plivo'" name="authToken" label="Auth Token" required
          placeholder="Enter auth token" />

        <TextField v-if="values.provider === 'twilio' || values.provider === 'exotel'" name="accountSid"
          label="Account SID" required placeholder="Enter account SID" />
        <TextField v-if="values.provider === 'twilio'" name="apiSecret" label="Api Secret" required
          placeholder="Enter api secret" />

        <!-- Exotel -->
        <TextField v-if="values.provider === 'exotel'" name="subDomain" label="Sub Domain" required
          placeholder="Enter sub domain" />
        <TextField v-if="values.provider === 'twilio' || values.provider === 'exotel' || values.provider === 'telnyx'"
          name="apiKey" label="Api Key" required placeholder="Enter Api Key" />
        <TextField v-if="values.provider === 'exotel'" name="apiToken" label="Api Token" required
          placeholder="Enter api token" />
        <TextField v-if="values.provider === 'exotel'" name="flowId" label="flow Id" required
          placeholder="Enter flow Id" />
        <TextField v-if="values.provider === 'telnyx'" name="publicKey" label="public key" required
          placeholder="Enter Public Key" />
        <TextField v-if="values.provider === 'telnyx'" name="connectionId" label="connection Id" required
          placeholder="Enter Connection Id" />
      </div>
      <div class="flex justify-end w-full">
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </Form>
  </DialogWrapper>
</template>
<script setup lang="ts">
import { useCount } from '@/composables/useRefresh';
import { nextTick } from 'vue';
import { cloudTelephonySchema } from '~/validationSchema/settings/cloudTelephonyValidatoin';

interface NumberModalState {
  open: string;
  id: string;
  // add other properties here
}
const props = defineProps<{
  numberModalState: {
    open: boolean,
    id: number | null
  }
}>();
const emit = defineEmits(["success"]);
const { refresh } = useCount();
const isLoading = ref(false)
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

watch(() => props.numberModalState.open, async () => {
  resetForm()
  if (props.numberModalState.id) {
    const getSingleDetails:any =  await $fetch(`/api/org/integrations/number-integration/${props.numberModalState.id}`)
    setFieldValue("provider", getSingleDetails.provider)
    setFieldValue("ivrIntegrationName", getSingleDetails.ivrIntegrationName)
    if (getSingleDetails.metadata) {
      // setTimeout(() => {
      await nextTick()
        Object.entries(getSingleDetails.metadata ?? {}).forEach(([key, value]: any) =>{
          if (values.hasOwnProperty(key)) {
            setFieldValue(key, value)
          }
        })
      // }, 0);
    }
  }
})

const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true
  const { provider, ...metadata } = values
  const payload = {
    provider,
    metadata,
    ivrIntegrationName: values.ivrIntegrationName,
  }
  try {
    if (props.numberModalState.id) {
      await $fetch(`/api/org/integrations/number-integration/${props.numberModalState.id}`, { method: "PUT", body: payload });
      toast.success("Integration updated successfully");
    } else {
      await $fetch("/api/org/integrations/number-integration", { method: "POST", body: payload });
      toast.success("Integration added successfully");
    }
    emit('success')
  } catch(error: any) {
    isLoading.value = false
    toast.error(error.data.statusMessage)
  }
  isLoading.value = false
});
</script>