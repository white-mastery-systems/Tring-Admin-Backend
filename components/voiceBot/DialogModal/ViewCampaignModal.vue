<script setup lang="ts">
import countryData from '~/assets/country-codes.json'
import { toDate } from 'radix-vue/date'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'

definePageMeta({
  middleware: "admin-only",
});

const viewCampaignStatusModalState = defineModel<{ open: boolean }>({
  default: {
    open: false,
  },
});
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
    provider: z.string().min(1, 'Provider is required'),
    // exoPhone: z.string()
    //   .min(1, 'Phone Number is required')
    //   .regex(phoneNumberPattern, 'Invalid phone number'),
    number: z.string().min(1, 'Country Code is required'),
    // time: z.string().min(1, 'Time is required'),
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
} = useForm({
  validationSchema: formSchema,
});


const allCoutryDialCode = computed(() =>
  countryData?.map((country) => country.dial_code),
);

const hour = ref("01");
const minute = ref("15");
const meridiem = ref("AM");
const date: any = ref(new Date());

const value = computed({
  get: () => values.date ? parseDate(values.date) : undefined,
  set: val => val,
})
// const dateValue = computed({
//   get: () => values.time ? parseDate(values.time) : undefined,
//   set: val => val,
// })
const {
  list: countyDialCodes,
  containerProps,
  wrapperProps,
} = useVirtualList(allCoutryDialCode, {
  itemHeight: 32,
});
// const [mobileField, mobileFieldProps] = defineField("exoPhone");
// const [countryCode, countryCodeProps] = defineField("countryCode");
const [selectDate, selectDateProps] = defineField("date");
// const [selectTime, selectTimeProps] = defineField("time"); 
// const timeString = ref('12:00 PM')

// watch(campaignModalState, (newState) => { });


// watch(selectTime, (newValue) => {
//   const formattedTime = newValue;
//   selectTime.value = formattedTime;
// });
const addVoiceBot = async (value: any) => {
  try {
    const bot = await $fetch("/api/voicebots", {
      method: "POST",
      body: { name: value.newBotName },
    });
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: bot.id },
    });
  } catch (err: any) {
    toast.error(err.data.data[0].message);
  }
};



const handleConnect = async (values: any) => {
  console.log(values, "values");
  const payload = values
  // await $fetch("/api/org/integrations/number-integration", { method: "POST", body: payload });
  // emit("success")
};
</script>
<template>
  <DialogWrapper v-model="viewCampaignStatusModalState" title="Add Campaign">
    <UiForm v-slot="{ values }" :validation-schema="formSchema" @submit="handleConnect" :keep-values="true"
      :validate-on-mount="false" class="space-y-2">
      <div class="flex">
        <!-- <UiFormField v-bind="selectTimeProps" name="time">
          <UiFormItem class="w-full">
            <UiFormLabel>Time <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <TimePicker :selectedHour="hour" :selectedMinute="minute" :selectedMeridiem="meridiem"
                :selectedDate="date" @update:selectedHour="(value) => hour = value " @update:selectedMinute="(value) => minute = value"
                @update:selectedMeridiem="(value) => meridiem = value" @update:selectedDate="(value) => date = value" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField> -->
        <UiFormField v-model="selectDate" v-bind="selectDateProps" name="date">
          <UiFormItem class="flex flex-col">
            <UiFormLabel>Date
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
            <!-- <FormDescription>
              Your date of birth is used to calculate your age.
            </FormDescription> -->
            <FormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <UiFormField v-slot="{ componentField }" name="number">
        <UiFormItem class="w-full">
          <UiFormLabel>
            Number Assigned <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-bind="componentField">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select a Number" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem value="+91673543252">+91673543252</UiSelectItem>
                <UiSelectItem value="+91873543252">+91873543252</UiSelectItem>
                <UiSelectItem value="+91973543252">+91973543252</UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <UiFormMessage />
        </UiFormItem>
      </UiFormField>
      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>
    </UiForm>
  </DialogWrapper>
</template>