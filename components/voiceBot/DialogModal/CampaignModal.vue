<script setup lang="ts">
import countryData from '~/assets/country-codes.json'
import { toDate } from 'radix-vue/date'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { campaignData } from '@/composables/useRefresh';

definePageMeta({
  middleware: "admin-only",
});
const emit = defineEmits<{ (e: "confirm"): void }>();
const campaignModalState = defineModel<{ open: boolean,id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const { refresh } = campaignData()

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const placeholder = ref()
const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/
const formSchema = toTypedSchema(
  z.object({
    date: z
      .string()
      .refine(v => v, { message: 'A date of birth is required.' }),
    exoPhone: z.string()
      .min(1, 'Phone Number is required')
      .regex(phoneNumberPattern, 'Invalid phone number'),
    countryCode: z.string().min(1, 'Country Code is required'),
  })
);

// const { handleSubmit, setFieldValue, values } = useForm({
//   validationSchema: formSchema,
//   initialValues: {

//   },
// })

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


const allCoutryDialCode = computed(() =>
  countryData?.map((country) => country.dial_code),
);

const value = computed({
  get: () => values.date ? parseDate(values.date) : undefined,
  set: val => val,
})
const {
  list: countyDialCodes,
  containerProps,
  wrapperProps,
} = useVirtualList(allCoutryDialCode, {
  itemHeight: 32,
});
const [mobileField, mobileFieldProps] = defineField("exoPhone");
const [countryCode, countryCodeProps] = defineField("countryCode");
const [selectDate, selectDateProps] = defineField("date"); 

watch(campaignModalState, (newState) => { });

watch(() => campaignModalState.value.open, async (newState) => {
  console.log(campaignModalState.value, "campaignModalState")
  if (campaignModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/org/campaign/${campaignModalState.value.id}`)
    setFieldValue("date", new Date(getSingleDetails.campaignDate).toISOString().slice(0, 10));
    setFieldValue("countryCode", getSingleDetails.countryCode);
    setFieldValue("exoPhone", getSingleDetails.phoneNumber);

  } else {
    resetForm()
  }
});


const handleConnect = handleSubmit(async (values: any) => {
  console.log(values, 'values')
  const payload = {
    countryCode: values.countryCode,
    campaignDate: new Date(values.date).toISOString(),
    phoneNumber: values.exoPhone,
    campaignTime: new Date(values.date).toISOString(),
  }
  
  try {
    if (campaignModalState.value.id) {
      await $fetch(`/api/org/campaign/${campaignModalState.value.id}`, { method: "PUT", body: payload });
      toast.success("Updated successfully")
    } else {
      await $fetch("/api/org/campaign", { method: "POST", body: payload });
      toast.success("Created successfully")
    }
    refresh()
    resetForm()
    emit("confirm")
  } catch(error: any) {
    toast.error(error.data)
  }
});
</script>
<template>
  <DialogWrapper v-model="campaignModalState" :title="(campaignModalState.id) ? 'Modify Campaign' : 'Add Campaign'">
    <UiForm v-slot="{ values }" @submit="handleConnect" :keep-values="true" :validate-on-mount="false"
      class="space-y-2">
      <UiFormField v-model="selectDate" v-bind="selectDateProps" name="date">

        <UiFormItem class="flex flex-col">
          <UiFormLabel :class="errors?.date ? 'text-[#ef4444]' : ''">Date
            <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiPopover>
            <UiPopoverTrigger as-child>
              <UiFormControl>
                <UiButton variant="outline" :class="cn(
                  'w-[240px] ps-3 text-start font-normal',
                    !value && 'text-muted-foreground',
                )">
                  <span>{{ value ? df.format(toDate(value)) : "Pick a date" }}</span>
                  <UiCalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                </UiButton>
                <input hidden>
              </UiFormControl>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-auto p-0">
              <UiCalendar v-model:placeholder="placeholder" v-model="value" calendar-label="Date of birth" initial-focus
                :min-value="new CalendarDate(1900, 1, 1)" :max-value="today(getLocalTimeZone())" @update:model-value="(v) => {
                  if (v) {
                    setFieldValue('date', v.toString())
                  }
                  else {
                    setFieldValue('date', undefined)
                  }
                }" />
            </UiPopoverContent>
          </UiPopover>
          <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.date }}</p>
          <!-- <FormDescription>
            Your date of birth is used to calculate your age.
          </FormDescription> -->

          <FormMessage />
        </UiFormItem>
      </UiFormField>
      <!-- {{ countryList }} || sdf -->
      <div class="flex gap-2">
        <UiFormField v-model="countryCode" v-bind="countryCodeProps" name="countryCode" class="mt-1">
          <UiFormItem class="mt-1">
            <UiFormLabel :class="errors?.countryCode ? 'text-[#ef4444]' : ''">Country code
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
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.countryCode }}</p>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField class="w-[80%]" v-model="mobileField" v-bind="mobileFieldProps" name="exoPhone">
          <UiFormItem class="w-full">
            <UiFormLabel :class="errors?.exoPhone ? 'text-[#ef4444]' : ''">
              Number Assigned <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-model="mobileField" v-bind="mobileFieldProps" placeholder="Enter phone number" />
            </UiFormControl>
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.exoPhone }}</p>
            <!-- <UiFormMessage :error="errors.phone?.number" /> -->
          </UiFormItem>
        </UiFormField>
      </div>
      <!-- <UiFormField v-slot="{ componentField }" name="audienceBucket">
        <UiFormItem class="w-full">
          <UiFormLabel>
            Add Audience Bucket <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-bind="componentField">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select a Bucket" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem value="twilio">Bucket One</UiSelectItem>
                <UiSelectItem value="exotel">Bucket Two</UiSelectItem>
                <UiSelectItem value="plivo">Bucket Three</UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <UiFormField v-slot="{ componentField }" name="audienceBucket">
        <UiFormItem class="w-full">
          <UiFormLabel>
            CRM Pipeline <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-bind="componentField">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select a Bucket" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem value="twilio">CRM One</UiSelectItem>
                <UiSelectItem value="exotel">CRM Two</UiSelectItem>
                <UiSelectItem value="plivo">CRM Three</UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField> -->
      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>
    </UiForm>
  </DialogWrapper>
</template>