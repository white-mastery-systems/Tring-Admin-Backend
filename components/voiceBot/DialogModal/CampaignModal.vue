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
const {  refresh } = campaignData()

const { status, data: campaignDataList, refresh: integrationRefresh, } = await useLazyFetch("/api/org/contact-list", {
  server: false,
  default: () => [],
});

const campaignListWithLabels = computed(() => {
  if (campaignDataList) {
    return campaignDataList.value.map((item: any) => {
       return {
      value: item.id,
      label: item.id ? item.name : '' // Change label based on id value
    };
    })
  }
})

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const placeholder = ref()
const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/
const formSchema = toTypedSchema(
  z.object({
    date: z
      .string({required_error: 'A date is required.'})
      .refine(v => v, { message: 'A date is required.' }),
    type: z.string({ required_error: 'Type is required' }).min(1, 'Audience Bucket Name is required'),
    exoPhone: z.string({ required_error: 'Phone Number is required' }).optional().default(""),
    countryCode: z.string({ required_error: 'Country Code is required' }).optional().default(""),
    audienceBucket: z.string({ required_error: 'Audience Bucket Name is required' }).min(1, 'Audience Bucket Name is required'),
  }).refine((data: any) => {
    if (data.type !== 'whatsapp') {
      const errors: Record<string, boolean> = {};
      if (!data.exoPhone) errors.exoPhone = true;
      if (!data.countryCode) errors.countryCode = true;
      return Object.keys(errors).length === 0;
    }
    return true;
  }, {
    message: 'Validation failed.',
    path: [],
  })
    .superRefine((data, ctx) => {
      if (data.type !== 'whatsapp') {
        if (!data.exoPhone) {
          ctx.addIssue({
            path: ['exoPhone'],
            message: 'Phone Number is required.',
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.countryCode) {
          ctx.addIssue({
            path: ['countryCode'],
            message: 'Country Code is required.',
            code: z.ZodIssueCode.custom,
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
const [selectAudienceBucketField, selectAudienceBucketProps] = defineField("audienceBucket")

watch(campaignModalState, (newState) => { });

watch(() => campaignModalState.value.open, async (newState) => {
  console.log(campaignModalState.value, "campaignModalState")
  if (campaignModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/org/campaign/${campaignModalState.value.id}`)
    console.log(getSingleDetails, "getSingleDetails")
    setFieldValue("date", new Date(getSingleDetails.campaignDate).toISOString().slice(0, 10));
    setFieldValue("countryCode", getSingleDetails.countryCode);
    setFieldValue("exoPhone", getSingleDetails.phoneNumber);
    setFieldValue("audienceBucket", getSingleDetails.contactListId);

  } else {
    resetForm()
  }
});


const handleConnect = handleSubmit(async (values: any) => {
  console.log(values, "values -- values")
  // if (values.type === 'voice') {
    const payload = {
      countryCode: values.countryCode,
      campaignDate: new Date(values.date).toISOString(),
      phoneNumber: values.exoPhone,
      campaignTime: new Date(values.date).toISOString(),
      contactListId: values.audienceBucket,
      type: values.type,
    }
  if (values.type === 'whatsapp') {
    delete payload.phoneNumber
    delete payload.countryCode
  } 
  // }
  
  try {
    if (campaignModalState.value.id) {
      await $fetch(`/api/org/campaign/${campaignModalState.value.id}`, { method: "PUT", body: payload });
      toast.success("Updated successfully")
    } else {
      await $fetch("/api/org/campaign", { method: "POST", body: payload });
      toast.success("Created successfully")
    }
    refresh()
    emit("confirm")
  } catch(error: any) {
    toast.error(error.data)
  }
});
</script>
<template>
  <DialogWrapper v-model="campaignModalState" :title="(campaignModalState.id) ? 'Modify Campaign' : 'Add Campaign'">
    <UiForm v-if="false" v-slot="{ values }" @submit="handleConnect" :keep-values="true" :validate-on-mount="false"
      class="space-y-2">
      <div class="flex gap-2">
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
                <UiCalendar v-model:placeholder="placeholder" v-model="value" calendar-label="Date of birth"
                  initial-focus :min-value="new CalendarDate(1900, 1, 1)" :max-value="today(getLocalTimeZone())"
                  @update:model-value="(v) => {
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
      </div>
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
      <UiFormField v-model="selectAudienceBucketField" v-bind="selectAudienceBucketProps" name="audienceBucket">
        <UiFormItem class="w-full">
          <UiFormLabel :class="errors?.audienceBucket ? 'text-[#ef4444]' : ''">
            Select Audience List <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="selectAudienceBucketField" v-bind="selectAudienceBucketProps">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Audience" />
              </UiSelectTrigger>
              <UiSelectContent>
                <div v-for="list in campaignDataList" :key="list.id">
                  <UiSelectItem :value="list.id">{{ list.name }}</UiSelectItem>
                </div>
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.audienceBucket }}</p>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <!-- <UiFormField v-slot="{ componentField }" name="audienceBucket">
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

    <form v-if="true" @submit.prevent="handleConnect" class="space-y-2">
      <div class="flex gap-2">
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
                <UiCalendar v-model:placeholder="placeholder" v-model="value" calendar-label="Date of birth"
                  initial-focus :min-value="new CalendarDate(1900, 1, 1)" :max-value="today(getLocalTimeZone())"
                  @update:model-value="(v) => {
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
        <SelectField name="type" label="Contact Method" placeholder="Select a method" :options="[
            {
              value: 'voice',
              label: 'Voice',
            }, {
              value: 'whatsapp',
              label: 'Whatsapp',
            },
          ]" required />
        <!-- <TextField name="name" label="Name" placeholder="enter integration name"
          helperText="Enter a unique identification for CRM integration"
          placeHolder="Eg: CRM-your company,CRM-your company" required /> -->
      </div>
      <div v-if="((values.type) ? (values.type === 'voice') : true)" class='flex gap-2'>
        <CountryCodeField class='w-[100px]' name="countryCode" label="Country Code" helperText="Enter your country code"
          required />
        <TextField :disableCharacters="true" name="exoPhone" label="Mobile number" helperText='' required
          placeholder="Enter your mobile number" />
      </div>
      <SelectField name="audienceBucket" label="Select Audience List" placeholder="Select Audience"
        :options="campaignListWithLabels" required />
      <div class="flex justify-end w-full">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>