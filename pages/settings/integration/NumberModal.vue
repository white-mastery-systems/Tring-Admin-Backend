<script setup lang="ts">
import countryData from '~/assets/country-codes.json'
import { useCount } from '@/composables/useRefresh';
import type { AnyFn } from '@vueuse/core';

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
const allCoutryDialCode = computed(() =>
  countryData?.map((country) => country.dial_code),
);
const providerList = ref([
  {
    value: 'twilio',
    label: 'Twilio',
  }, {
    value: 'exotel',
    label: 'Exotel',
  }, {
    value: 'plivo',
    label: 'Plivo',
  }, {
    value: 'doocti',
    label: 'Doocti',
  },
])
const {
  list: countyDialCodes,
  containerProps,
  wrapperProps,
} = useVirtualList(allCoutryDialCode, {
  itemHeight: 32,
});

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/
const formSchema = toTypedSchema(
  z.object({
    provider: z.string({ required_error: 'Provider is required' }).min(1, 'Provider is required'),
    exoPhone: z.string({ required_error: 'Phone Number is required'  })
      .min(1, 'Phone Number is required')
      .regex(phoneNumberPattern, 'Invalid phone number'),
    countryCode: z.string({ required_error: 'Country Code is required' }).min(1, 'Country Code is required'),
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
  if (props.numberModalState.id) {
    const getSingleDetails:any =  await $fetch(`/api/org/integrations/number-integration/${props.numberModalState.id}`)
    console.log(getSingleDetails, 'getSingleDetails')
    setFieldValue("provider", getSingleDetails.provider),
    setFieldValue("countryCode", getSingleDetails.countryCode),
    setFieldValue("exoPhone", getSingleDetails.exoPhone)
  } else {
    resetForm()
  }
})
// onMounted(async () => {
//   loadCountries()
// });
const [provideField, provideFieldProps] = defineField("provider")
const [mobileField, mobileFieldProps] = defineField("exoPhone");
const [countryCode, countryCodeProps] = defineField("countryCode");


const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true
  const payload = values
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
    console.log(error.data)
    isLoading.value = false
    // toast.success(error.data.)
  }
  isLoading.value = false
});
</script>

<template>
  <DialogWrapper v-model="props.numberModalState" title="Add New Exophone">
    <Form @submit="handleConnect" class="space-y-3">
      <SelectField name="provider" placeholder="Select a provider" :options="providerList">
      </SelectField>
      <div class='flex gap-2'>
        <CountryCodeField class='w-[100px]' name="countryCode" label="Country Code" helperText="Enter your country code"
          required />
        <TextField :disableCharacters="true" name="exoPhone" label="Mobile number" helperText='' required
          placeholder="Enter phone number" />
      </div>
      <div class="flex justify-end w-full">
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </Form>
  </DialogWrapper>
</template>
<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->
