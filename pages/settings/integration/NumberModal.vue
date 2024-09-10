<script setup lang="ts">
import countryData from '~/assets/country-codes.json'
import { useCount } from '@/composables/useRefresh';

const emit = defineEmits(["success"]);
const { refresh } = useCount();
const numberModalState: any = defineModel<{ open: boolean }>({
  default: {
    open: false,
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
} = useForm({
  validationSchema: formSchema,
});

watch(numberModalState, (newState) => { });

// onMounted(async () => {
//   loadCountries()
// });
const [mobileField, mobileFieldProps] = defineField("exoPhone");
const [countryCode, countryCodeProps] = defineField("countryCode");


const handleConnect = async (values: any) => {
  const payload = values
  try {
    await $fetch("/api/org/integrations/number-integration", { method: "POST", body: payload });
    refresh()
    emit('success')
  } catch(error: any) {
    console.log(error.data)
    // toast.success(error.data.)
  }
};
</script>

<template>
  <DialogWrapper v-model="numberModalState" title="Add New Number">
    <UiForm v-slot="{ values }" :validation-schema="formSchema" @submit="handleConnect" :keep-values="true"
    :validate-on-mount="false" class="space-y-2">
    <UiFormField v-slot="{ componentField }" name="provider">
      <UiFormItem class="w-full">
        <UiFormLabel>
            Provider <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-bind="componentField">
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
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <!-- {{ countryList }} || sdf -->
      <div class="flex gap-2">
        <UiFormField v-model="countryCode" v-bind="countryCodeProps" name="countryCode" class="mt-1">
          <UiFormItem class="mt-1">
            <UiFormLabel>Country code
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
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField class="w-[80%]" v-model="mobileField" v-bind="mobileFieldProps" name="exoPhone">
          <UiFormItem class="w-full">
            <UiFormLabel>
              Phone Number <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-model="mobileField" v-bind="mobileFieldProps" placeholder="Enter phone number" />
            </UiFormControl>
            <!-- <UiFormMessage :error="errors.phone?.number" /> -->
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
