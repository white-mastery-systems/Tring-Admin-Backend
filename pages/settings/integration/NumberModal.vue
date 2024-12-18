<template>
  <DialogWrapper v-model="props.numberModalState" title="Add New Cloud Telephone">
    <Form @submit="handleConnect" class="space-y-3">
      <SelectField name="provider" placeholder="Select a provider" :options="providerList">
      </SelectField>
      <div class='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 xl:grid-cols-2'>
        <TextField v-if="values.provider === 'twilio' || values.provider === 'exotel'" name="accountSid"
          label="Account SID" required placeholder="Enter account SID" />
        <!-- <TextField v-if="values.provider === 'twilio'" name="authToken" label="Auth Token" required
          placeholder="Enter auth token" /> -->
        <TextField v-if="values.provider === 'twilio'" name="apiSecret" label="Api Secret" required
          placeholder="Enter api secret" />

        <!-- Exotel -->
        <TextField v-if="values.provider === 'exotel'" name="subDomain" label="Sub Domain" required
          placeholder="Enter sub domain" />
        <TextField v-if="values.provider === 'twilio' || values.provider === 'exotel' || values.provider === 'telnyx'" name="apiKey" label="Api Key"
          required placeholder="Enter Api Key" />
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
import type { AnyFn } from '@vueuse/core';
import { nextTick } from 'vue';

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
// const numberModalState: any = defineModel<{ open: boolean, id: any }>({
//   default: {
//     open: false,
//     id: null,
//   },
// });
const isLoading = ref(false)
const providerList = ref([
  {
    value: 'twilio',
    label: 'Twilio',
  }, {
    value: 'exotel',
    label: 'Exotel',
  }, {
    value: 'telnyx',
    label: 'Telnyx',
  }
])

const formSchema = toTypedSchema(
  z.object({
      provider: z.string({ required_error: 'Provider is required.' }).nonempty({ message: 'Provider is required.' }),
      accountSid: z.string().optional(),
      apiSecret: z.string().optional(),
      // authToken: z.string().optional(),
      subDomain: z.string().optional(),
      apiKey: z.string().min(2, 'API Key is required'),
      apiToken: z.string().optional(),
      flowId: z.string().optional(),
      publicKey: z.string().optional(),
      connectionId: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Provider-specific validation
      if (data.provider === 'twilio') {
        if (!data.accountSid) {
          ctx.addIssue({
            path: ['accountSid'],
            message: 'Account SID is required for Twilio.',
          });
        }
        // if (!data.authToken) {
        //   ctx.addIssue({
        //     path: ['authToken'],
        //     message: 'Auth Token is required for Twilio.',
        //   });
        // }
        if (!data.apiSecret) {
          ctx.addIssue({
            path: ['apiSecret'],
            message: 'Api secret is required for Twilio.',
          });
        }
      }

      if (data.provider === 'exotel') {
        if (!data.accountSid) {
          ctx.addIssue({
            path: ['accountSid'],
            message: 'Account SID is required for Exotel.',
          });
        }
        // if (!data.apiKey) {
        //   ctx.addIssue({
        //     path: ['apiKey'],
        //     message: 'API Key is required for Exotel.',
        //   });
        // }
        if (!data.subDomain) {
          ctx.addIssue({
            path: ['subDomain'],
            message: 'Sub Domain is required for Exotel.',
          });
        }
        if (!data.apiToken) {
          ctx.addIssue({
            path: ['apiToken'],
            message: 'API Token is required for Exotel.',
          });
        }
        if (!data.flowId) {
          ctx.addIssue({
            path: ['flowId'],
            message: 'Flow ID is required for Exotel.',
          });
        }
      }

      if (data.provider === 'telnyx') {
        // if (!data.apiKey) {
        //   ctx.addIssue({
        //     path: ['apiKey'],
        //     message: 'API Key is required for Telnyx.',
        //   });
        // }
        if (!data.publicKey) {
          ctx.addIssue({
            path: ['publicKey'],
            message: 'Public Key is required for Telnyx.',
          });
        }
        if (!data.connectionId) {
          ctx.addIssue({
            path: ['connectionId'],
            message: 'Connection Id is required for Telnyx.',
          });
        }
      }
    })
);

const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: formSchema,
});

// watch(props.numberModalState, (newState) => { 
//   console.log(newState, "newState -- newState")
// });

watch(() => props.numberModalState.open, async () => {
  resetForm()
  if (props.numberModalState.id) {
    const getSingleDetails:any =  await $fetch(`/api/org/integrations/number-integration/${props.numberModalState.id}`)
    setFieldValue("provider", getSingleDetails.provider)
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
// onMounted(async () => {
//   loadCountries()
// });

const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true
  const { provider, ...metadata } = values
  const payload = {
    provider,
    metadata,
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

<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->
