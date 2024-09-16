<script setup lang="ts">
import countryData from '~/assets/country-codes.json'
import { useCount } from '@/composables/useRefresh';

const emit = defineEmits(["success"]);
const { refresh } = useCount();
const numberModalState: any = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: null,
  },
});

const allCoutryDialCode = computed(() =>
  countryData?.map((country) => country.dial_code),
);

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
    provider: z.string().min(1, 'Provider is required'),
    exoPhone: z.string()
      .min(1, 'Phone Number is required')
      .regex(phoneNumberPattern, 'Invalid phone number'),
      countryCode: z.string().min(1, 'Country Code is required'),
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

watch(numberModalState, (newState) => { });

watch(() => numberModalState.value.open, async () => {
  if (numberModalState.value.id) {
    const getSingleDetails:any =  await $fetch(`/api/org/integrations/number-integration/${numberModalState.value.id}`)
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
  const payload = values
  try {
    if (numberModalState.value.id) {
      await $fetch(`/api/org/integrations/number-integration/${numberModalState.value.id}`, { method: "PUT", body: payload });
      toast.success("Integration updated successfully");
    } else {
      await $fetch("/api/org/integrations/number-integration", { method: "POST", body: payload });
      toast.success("Integration added successfully");
    }
    refresh()
    emit('success')
  } catch(error: any) {
    console.log(error.data)
    // toast.success(error.data.)
  }
});
</script>

<template>
  <DialogWrapper v-model="numberModalState" title="Add New ExoPhone">
    <UiForm v-slot="{ values }" @submit="handleConnect" :keep-values="true" :validate-on-mount="false"
      class="space-y-2">
      <UiFormField v-model="provideField" v-bind="provideFieldProps" name="provider">
        <UiFormItem class="w-full">
          <UiFormLabel :class="(errors.provider) ? 'text-[#ef4444]' : ''">
            Provider <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="provideField" v-bind="provideFieldProps">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select a provider" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem value="twilio">Twilio</UiSelectItem>
                <UiSelectItem value="exotel">Exotel</UiSelectItem>
                <UiSelectItem value="plivo">Plivo</UiSelectItem>
                <UiSelectItem value="doocti">Doocti</UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors.provider }}</p>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <!-- {{ countryList }} || sdf -->
      <div class="flex gap-2">
        <UiFormField v-model="countryCode" v-bind="countryCodeProps" name="countryCode" class="mt-1">
          <UiFormItem class="mt-1">
            <UiFormLabel :class="(errors.provider) ? 'text-[#ef4444]' : ''">Country code
              <span class="text-sm text-red-500">*</span>
            </UiFormLabel>
            <UiPopover>
              <UiPopoverTrigger as-child>
                <UiFormControl>
                  <UiButton variant="outline" role="combobox" :class="cn(
                    'w-[130px] justify-between',
                    !values.countryCode && 'text-muted-foreground',
                  )
                    ">
                    {{
                    values.countryCode
                    ? allCoutryDialCode.find(
                    (dialCode: any) =>
                    dialCode === values.countryCode,
                    )
                    : "Select code..."
                    }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </UiButton>
                </UiFormControl>
              </UiPopoverTrigger>
              <UiPopoverContent class="w-[130px] p-0">
                <UiCommand>
                  <UiCommandInput placeholder="Search code..." />
                  <UiCommandEmpty>No codes found.</UiCommandEmpty>
                  <UiCommandList>
                    <div v-bind="containerProps" class="max-h-52">
                      <div v-bind="wrapperProps">
                        <UiCommandGroup>
                          <UiCommandItem v-for="dialCode in countyDialCodes" :key="dialCode.data" :value="dialCode.data"
                            @select="() => {
                                setFieldValue('countryCode', dialCode.data);
                              }
                              " style="height: 32px">
                            <Check :class="cn(
                              'mr-2 h-4 w-4',
                              dialCode.data === values.countryCode
                                ? 'opacity-100'
                                : 'opacity-0',
                            )
                              " />
                            {{ dialCode.data }}
                          </UiCommandItem>
                        </UiCommandGroup>
                      </div>
                    </div>
                  </UiCommandList>
                </UiCommand>
              </UiPopoverContent>
            </UiPopover>
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors.countryCode }}</p>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField class="w-[80%]" v-model="mobileField" v-bind="mobileFieldProps" name="exoPhone">
          <UiFormItem class="w-full">
            <UiFormLabel :class="(errors.provider) ? 'text-[#ef4444]' : ''">
              Phone Number <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-model="mobileField" v-bind="mobileFieldProps" placeholder="Enter phone number" />
            </UiFormControl>
            <!-- <UiFormMessage :error="errors.phone?.number" /> -->
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors.exoPhone }}</p>
          </UiFormItem>
        </UiFormField>
      </div>
      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>
    </UiForm>
  </DialogWrapper>
</template>
<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->
