<template>
  <DialogWrapper v-model="campaignModalState" :title="campaignModalState.id ? 'Modify Campaign' : 'Add Campaign'">
    <form @submit.prevent="handleConnect" class="space-y-2">
      <!-- w-[70%] sm:w-[70%] md:w-[70%] lg:w-[75%] xl:w-[75%] -->
      <span class="flex gap-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <TextField name="campaignName" label="Campaign Name" placeholder="Enter campaign name" required>
        </TextField>
        <SelectField name="contactMethod" label="Contact Method" placeholder="Select type" class="w-full"
          @input="handleType($event)" :options="[
            {
              value: 'voice',
              label: 'Voice',
            }, {
              value: 'whatsapp',
              label: 'Whatsapp',
            },
          ]" required />
      </span>
      <!-- {{ BucketList }} -->
      <SelectField v-if="values.contactMethod === 'whatsapp'" name="bucketId" label="Select Bucket"
        placeholder="Select Bucket" :options="BucketList" required />
      <div v-if="values.contactMethod === 'whatsapp'" class="flex gap-2">
        <DatePickerField name="date" label="Date" placeholder="Select a Date" required />
        <TimePickerField name="time" label="Time" required> </TimePickerField>
        <!-- <SelectField label="Template" name="templateName" :multiple="false" :required="true"
          placeholder="Select your template" :options="templateData?.map((integration: any) => ({
            label: integration.name,
            value: integration.id,
          }))
            " /> -->
      </div>
      <div class="flex gap-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <!-- {{ templateData }} || asdad -->
        <!-- {{ IntegrationData }} -->
        <SelectField v-if="values.contactMethod === 'voice'" name="bucketId" label="Select Bucket"
          placeholder="Select Bucket" :options="BucketList" required />
        <SelectField v-if="values.contactMethod === 'whatsapp'" label="Integration" name="integrationId"
          :multiple="false" :required="true" placeholder="Select your integration template" :options="IntegrationData?.map((integration: any) => ({
            label: integration.name,
            value: integration.id,
          }))
            " @input="handleIntegration($event)" />
        <SelectField v-if="values.contactMethod === 'whatsapp' && values.integrationId" label="Template"
          name="templateName" :multiple="false" :required="true" placeholder="Select your template"
          :options="templateData" />
        <SelectField v-if="values.contactMethod === 'voice'" name="botId" label="Select Bot"
          placeholder="Select bot list" :options="BotList" required />
      </div>
      <div v-if="values.contactMethod === 'voice'" class="flex grid grid-cols-2 gap-2">
        <span>
          <TimePickerField name="startTime" label="Start Time" required> </TimePickerField>
        </span>
        <span>
          <TimePickerField name="endTime" label="End Time" required> </TimePickerField>
        </span>
      </div>
      <!-- <div v-if="values.contactMethod === 'whatsapp'" class="flex gap-2">
        <CountryCodeField class="w-[100px]" name="countryCode" label="Country Code" helperText="Enter your country code"
          required />
        <TextField :disableCharacters="true" name="exoPhone" label="Mobile number" helperText="" required
          placeholder="Enter your mobile number" />
      </div> -->
      <TextField v-if="values.contactMethod === 'voice'" type="number" label="Calls Per Trigger" name="callsPerTrigger"
        required placeholder="Enter calls per trigger" disableCharacters />

      <div class="flex w-full justify-end">
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
<script setup lang="ts">
import { DateFormatter } from "@internationalized/date";
import { useTimeWatcher } from '~/composables/useTimeWatcher';

definePageMeta({
  middleware: "admin-only",
});
const emit = defineEmits<{ (e: "confirm"): void }>();
const campaignModalState = defineModel<{ open: boolean; id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const BucketList = ref([])
const BotList = ref([])
const isFirstRun = ref(true)
const getEditList = ref([])
const templateData = ref([])

const {
  status,
  data: campaignDataList,
  refresh: contactsRefresh,
} = await useLazyFetch("/api/org/contact-list", {
  server: false,
  default: () => [],
});

const campaignListWithLabels = computed(() => {
  if (campaignDataList) {
    return campaignDataList.value?.map((item: any) => {
      return {
        value: item.id,
        label: item.id ? item.name : "", // Change label based on id value
      };
    });
  }
});

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});
const createEditCampaignValidation = toTypedSchema(z
  .object({
    campaignName: z.string({ required_error: "Campaign Name is required." }).min(1),
    contactMethod: z.string({ required_error: "Type is required." }).min(1),
    bucketId: z.string({ required_error: "Bucket ID is required." }).min(1),
    integrationId: z.string().optional(),
    botId: z.string().optional(),
    date: z
      .string()
      .optional()
      .refine((v) => v || true, { message: "Date is required for WhatsApp." }),
    time: z
      .string()
      .optional(),
    // .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format." }),
    startTime: z
      .string()
      .optional(),
    // .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid start time format." }),
    endTime: z
      .string()
      .optional(),
    // .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid end time format." }),
    // audienceBucket: z.string().optional(),
    templateName: z.string().optional(),
    callsPerTrigger: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const isWhatsApp = data.contactMethod === "whatsapp";
    const isVoice = data.contactMethod === "voice";

    ctx.path.forEach((path) => {
      if (path[0] !== "contactMethod") {
        ctx.addIssue({ path, message: "", code: z.ZodIssueCode.invalid_type });
      }
    });
    // Conditional validation for WhatsApp
    if (isWhatsApp) {
      if (!data.date) {
        ctx.addIssue({
          path: ["date"],
          message: "Date is required for WhatsApp campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
      // if (!data.audienceBucket) {
      //   ctx.addIssue({
      //     path: ["audienceBucket"],
      //     message: "Audience Bucket is required for WhatsApp.",
      //     code: z.ZodIssueCode.custom,
      //   });
      // }
      if (!data.templateName) {
        ctx.addIssue({
          path: ["templateName"],
          message: "Template is required for WhatsApp.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.integrationId) {
        ctx.addIssue({
          path: ["integrationId"],
          message: "IntegrationId is required for WhatsApp.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.time) {
        ctx.addIssue({
          path: ["time"],
          message: "Time are required for whatsapp campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // Conditional validation for Voice
    if (isVoice) {
      if (!data.botId) {
        ctx.addIssue({
          path: ["botId"],
          message: "Bot ID is required for Voice campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.callsPerTrigger) {
        ctx.addIssue({
          path: ["callsPerTrigger"],
          message: "CallsPerTrigger is required for Voice campaigns.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.startTime || !data.endTime) {
        ctx.addIssue({
          path: ["startTime"],
          message: "Start Time and End Time are required for Voice campaigns.",
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
  validationSchema: createEditCampaignValidation,
})

useTimeWatcher(values, setFieldValue)
const {
  status: integrationLoadingStatus,
  data: IntegrationData,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations", {
  server: false,
  query: { q: "channel" },
  default: () => [],
});
const templates = ref<any>([]);
const phoneNumbers = ref<any>([]);
const isLoading = ref(false);

// watch(
//   () => values,
//   async (newValue) => {
//     if (newValue) {
//       if (newValue.integrationId) {
//         const data = await $fetch("/api/org/integrations/wa-template", {
//           method: "POST",
//           body: {
//             integrationId: newValue.integrationId,
//           },
//         });
//         templates.value = data?.templateResponse?.data?.map(
//           (dat: { name: string }) => dat.name,
//         );
//         phoneNumbers.value = data?.phoneNumberRespone?.data?.map(
//           (phone: any) => ({
//             label: phone.display_phone_number,
//             value: phone.id,
//           }),
//         );
//       }
//     }
//   },
//   { deep: true },
// );

watch(errors, (newValue) => {
  console.log(newValue, 'newValue')
})
// const [timeField, timeFieldAttrs] = defineField("startTime");

watch(
  () => campaignModalState.value.open,
  async (newState) => {
    resetForm();
    isFirstRun.value = true
    if (campaignModalState.value.id) {
      const getSingleDetails: any = await $fetch(
        `/api/org/campaign/${campaignModalState.value.id}`,
      );
      setFieldValue("date", getSingleDetails.botConfig.date);
      setFieldValue("campaignName", getSingleDetails.campaignName);
      setFieldValue("contactMethod", getSingleDetails?.contactMethod);
      setFieldValue("bucketId", getSingleDetails?.bucketId);
      setFieldValue("botId", getSingleDetails?.botConfig.botId);
      setFieldValue("startTime", getSingleDetails?.botConfig.workingStartTime);
      setFieldValue("endTime", getSingleDetails?.botConfig.workingEndTime);
      setFieldValue("time", getSingleDetails?.botConfig.scheduleTime);
      if (getSingleDetails?.contactMethod === "voice") setFieldValue("callsPerTrigger", Number(getSingleDetails?.botConfig?.callsPerTrigger));
      setFieldValue("templateName", getSingleDetails?.botConfig.templateName);
      setFieldValue("integrationId", getSingleDetails?.botConfig.integrationId);
      // const time = getSingleDetails.campaignTime.match(/\d{2}:\d{2}/)[0];
      // setFieldValue("startTime", time);
    }
  },
);

watch(() => values.contactMethod, (newValue) => {
  if (isFirstRun.value) {
    isFirstRun.value = false
    return
  }
  console.log("isFirstRun.value", isFirstRun.value);
  if (campaignModalState.value.id && !isFirstRun.value) setFieldValue("bucketId", "");
});

onMounted(async () => {
  const getResponse = await getBucketDetailsAddCampaign('chat');

  BucketList.value = getResponse?.map((item: any) => ({
    label: item.name,
    value: item.id,
  }))
});

const handleType = async (type: string) => {
  const getResponse = await getBucketDetailsAddCampaign(type);

  BucketList.value = getResponse?.map((item: any) => ({
    label: item.name,
    value: item.id,
  }))
  if (type === 'voice') {
    const getBot = await getVoiceBotList()

    BotList.value = getBot?.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
  }
};

const handleIntegration = async (event: any) => {
  const getList = await getWhatsappTemplateList(event)
  templateData.value = getList.templates?.map((item: any) => ({
    label: item.name,
    value: item.name,
  }))
}

const handleConnect = handleSubmit(async (values: any) => {
  isFirstRun.value = true
  // const getTime = convertTo12HourFormat(values?.startTime);
  // const getUTC = convertToUTC(getTime);

  // endTime
  // const payload = {
  //   countryCode: values.countryCode,
  //   campaignDate: new Date(values.date).toISOString(),
  //   phoneNumber: values.exoPhone,
  //   campaignTime: getUTC,
  //   contactListId: values.audienceBucket,
  //   type: values.type,
  //   templateName: values.templateName,
  // };
  // if (values.type === "whatsapp") {
  //   delete payload.phoneNumber;
  //   delete payload.countryCode;
  // }
  const basePayload = {
    campaignName: values.campaignName,
    contactMethod: values.contactMethod,
    bucketId: values.bucketId,
  };
  const botConfig =
    values.contactMethod === 'voice'
      ? {
        botId: values.botId,
        workingStartTime: values.startTime,
        workingEndTime: values.endTime,
        callsPerTrigger: values.callsPerTrigger.toString(),
      }
      : {
        scheduleTime: values.time,
        date: values.date,
        integrationId: values.integrationId,
        templateName: values.templateName,
      };
  const payload = {
    ...basePayload,
    botConfig,
  };
  isLoading.value = true;
  try {
    if (campaignModalState.value.id) {
      await $fetch(`/api/org/campaign/${campaignModalState.value.id}`, {
        method: "PUT",
        body: payload,
      });
      toast.success("Updated successfully");
    } else {
      await $fetch("/api/org/campaign", { method: "POST", body: payload });
      toast.success("Created successfully");
    }
    emit("confirm");
  } catch (error: any) {
    isLoading.value = false;
    toast.error(error.data.statusMessage);
  }
  isLoading.value = false;
});
</script>