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

const { status, data: campaignDataList, refresh: integrationRefresh, } = await useLazyFetch("/api/org/contact-list", {
  server: false,
  default: () => [],
});

const campaignListWithLabels = computed(() => {
  if (campaignDataList) {
    return campaignDataList.value?.map((item: any) => {
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
    appt: z
      .string({ required_error: 'Time is required.' })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format.' })
      .refine(v => !!v, { message: 'Time is required.' }),
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
const [timeField, timeFieldAttrs] = defineField("appt");

watch(campaignModalState, (newState) => { });

watch(() => campaignModalState.value.open, async (newState) => {
  console.log(campaignModalState.value, "campaignModalState")
  resetForm()
  if (campaignModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/org/campaign/${campaignModalState.value.id}`)
    setFieldValue("date", new Date(getSingleDetails.campaignDate).toISOString().slice(0, 10));
    setFieldValue("countryCode", getSingleDetails.countryCode);
    setFieldValue("exoPhone", getSingleDetails.phoneNumber);
    setFieldValue("audienceBucket", getSingleDetails.contactListId);
    setFieldValue("type", getSingleDetails?.type);
    const time = getSingleDetails.campaignTime.match(/\d{2}:\d{2}/)[0]
    setFieldValue("appt", time);

  }
});


 
const createUTCDate = (dateString: any, timeString: any) => {
  const [hours, minutes] = timeString.split(':');
  const dateParts = dateString.split('-'); // Split the date string
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed
  const day = parseInt(dateParts[2], 10);

  // Create a date object in UTC
  return new Date(Date.UTC(year, month, day, hours, minutes));
}

const handleConnect = handleSubmit(async (values: any) => {
  const getTime = convertTo12HourFormat(values.appt)
  const getUTC = convertToUTC(getTime)

    const payload = {
      countryCode: values.countryCode,
      campaignDate: new Date(values.date).toISOString(),
      phoneNumber: values.exoPhone,
      campaignTime: getUTC,
      contactListId: values.audienceBucket,
      type: values.type,
    }
  if (values.type === 'whatsapp') {
    delete payload.phoneNumber
    delete payload.countryCode
  } 
  
  try {
    if (campaignModalState.value.id) {
      await $fetch(`/api/org/campaign/${campaignModalState.value.id}`, { method: "PUT", body: payload });
      toast.success("Updated successfully")
    } else {
      await $fetch("/api/org/campaign", { method: "POST", body: payload });
      toast.success("Created successfully")
    }
    emit("confirm")
  } catch(error: any) {
    toast.error(error.data)
  }

});
</script>
<template>
  <DialogWrapper v-model="campaignModalState" :title="(campaignModalState.id) ? 'Modify Campaign' : 'Add Campaign'">
    <form v-if="true" @submit.prevent="handleConnect" class="space-y-2">
      <div class="flex grid grid-cols-3 gap-2">
        <DatePickerField name="date" label="Date" placeholder="Select a Date" required />
        <!-- <div class="flex flex-col justify-start items-center gap-2 font-medium">
          <label for="appt" class="pb-[1px]">Select a time <span
              class="pb-2 text-red-500 font-medium text-[18px]">*</span></label>
          <input type="time" id="appt" name="appt" class="border-[1px] border-solid border-grey rounded-[6px] py-1.5 px-2">
        </div> -->
        <div class="flex flex-col justify-start items-center gap-2 font-medium">
          <label for="appt" class="pb-[1px] text-gray-700 w-[70%]" :class="(errors.appt) ? 'text-red-500' : ''">
            Time <span class="pb-2 text-red-500 font-medium text-[18px]">*</span>
          </label>
          <input v-model="timeField" type="time" id="appt" :class="[
            'border-[1px] border-solid rounded-[6px] py-[8px] px-2 font-normal text-[14px]',
          ]">
          <p v-if="errors.appt" class="text-red-500 text-[13px]">{{ errors.appt }}</p>
        </div>
        <SelectField name="type" label="Contact Method" placeholder="Select a method" :options="[
            {
              value: 'voice',
              label: 'Voice',
            }, {
              value: 'whatsapp',
              label: 'Whatsapp',
            },
          ]" required />
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