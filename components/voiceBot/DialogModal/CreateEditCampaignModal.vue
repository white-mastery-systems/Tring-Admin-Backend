<script setup lang="ts">
  import { DateFormatter } from "@internationalized/date";

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
  const placeholder = ref();
  const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
  const createEditCampaignValidation = toTypedSchema(
    z
      .object({
        date: z
          .string({ required_error: "A date is required." })
          .refine((v) => v, { message: "A date is required." }),
        appt: z
          .string({ required_error: "Time is required." })
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Invalid time format.",
          })
          .refine((v) => !!v, { message: "Time is required." }),
        type: z
          .string({ required_error: "Type is required" })
          .min(1, "Audience Bucket Name is required"),
        exoPhone: z
          .string({ required_error: "Phone Number is required" })
          .optional()
          .default(""),
        countryCode: z
          .string({ required_error: "Country Code is required" })
          .optional()
          .default(""),
        audienceBucket: z
          .string({ required_error: "Audience Bucket Name is required" })
          .min(1, "Audience Bucket Name is required"),
        templateId: z
          .string({ required_error: "Template is required" })

          .default(""),
      })
      .refine(
        (data) => {
          if (data.type === "whatsapp") {
            return !!data.templateId;
          }
          return true;
        },
        {
          message: "Template ID is required.",
          path: ["templateId"],
        },
      )
      .refine(
        (data: any) => {
          if (data.type !== "whatsapp") {
            const errors: Record<string, boolean> = {};
            if (!data.exoPhone) errors.exoPhone = true;
            if (!data.countryCode) errors.countryCode = true;
            return Object.keys(errors).length === 0;
          }
          return true;
        },
        {
          message: "Validation failed.",
          path: [],
        },
      )
      .superRefine((data, ctx) => {
        if (data.type !== "whatsapp") {
          errors.templateId = true;
          if (!data.exoPhone) {
            ctx.addIssue({
              path: ["exoPhone"],
              message: "Phone Number is required.",
              code: z.ZodIssueCode.custom,
            });
          }
          if (!data.countryCode) {
            ctx.addIssue({
              path: ["countryCode"],
              message: "Country Code is required.",
              code: z.ZodIssueCode.custom,
            });
          }
          // if (data.integrationId && data.integrationId.length > 0) {
          //   if (!data.templateId) {
          //     ctx.addIssue({
          //       path: ["templateId"],
          //       message:
          //         "Template ID is required when Integration ID is present.",
          //       code: z.ZodIssueCode.custom,
          //     });
          //   }
          //   if (!data.phoneId) {
          //     ctx.addIssue({
          //       path: ["phoneId"],
          //       message: "Phone ID is required when Integration ID is present.",
          //       code: z.ZodIssueCode.custom,
          //     });
          //   }
          // }
        }
      }),
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
  });
  const {
    status: integrationLoadingStatus,
    data: templateData,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/templates", {
    server: false,
    default: () => [],
  });
  const templates = ref<any>([]);
  const phoneNumbers = ref<any>([]);
  const isLoading = ref(false);

  watch(
    () => values,
    async (newValue) => {
      console.log({ newValue });
      if (newValue) {
        if (newValue.integrationId) {
          const data = await $fetch("/api/org/integrations/wa-template", {
            method: "POST",
            body: {
              integrationId: newValue.integrationId,
            },
          });
          templates.value = data?.templateResponse?.data?.map(
            (dat: { name: string }) => dat.name,
          );
          phoneNumbers.value = data?.phoneNumberRespone?.data?.map(
            (phone: any) => ({
              label: phone.display_phone_number,
              value: phone.id,
            }),
          );
        }
      }
    },
    { deep: true },
  );

  const [timeField, timeFieldAttrs] = defineField("appt");

  watch(
    () => campaignModalState.value.open,
    async (newState) => {
      resetForm();
      if (campaignModalState.value.id) {
        const getSingleDetails: any = await $fetch(
          `/api/org/campaign/${campaignModalState.value.id}`,
        );
        setFieldValue(
          "date",
          new Date(getSingleDetails.campaignDate).toISOString().slice(0, 10),
        );
        setFieldValue("countryCode", getSingleDetails.countryCode);
        setFieldValue("exoPhone", getSingleDetails.phoneNumber);
        setFieldValue("audienceBucket", getSingleDetails.contactListId);
        setFieldValue("type", getSingleDetails?.type);
        const time = getSingleDetails.campaignTime.match(/\d{2}:\d{2}/)[0];
        setFieldValue("appt", time);
      }
    },
  );

  const handleConnect = handleSubmit(async (values: any) => {
    const getTime = convertTo12HourFormat(values.appt);
    const getUTC = convertToUTC(getTime);
    const payload = {
      countryCode: values.countryCode,
      campaignDate: new Date(values.date).toISOString(),
      phoneNumber: values.exoPhone,
      campaignTime: getUTC,
      contactListId: values.audienceBucket,
      type: values.type,
      templateId: values.templateId,
    };
    if (values.type === "whatsapp") {
      delete payload.phoneNumber;
      delete payload.countryCode;
    }
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
      toast.error(error.data);
    }
    isLoading.value = false;
  });
</script>
<template>
  <DialogWrapper
    v-model="campaignModalState"
    :title="campaignModalState.id ? 'Modify Campaign' : 'Add Campaign'"
  >
    <form @submit.prevent="handleConnect" class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="w-[70%] sm:w-[70%] md:w-[70%] lg:w-[75%] xl:w-[75%]">
          <DatePickerField
            name="date"
            label="Date"
            placeholder="Select a Date"
            required
          />
        </span>
        <!-- <div class="flex flex-col justify-start items-center gap-2 font-medium">
          <label for="appt" class="pb-[1px]">Select a time <span
              class="pb-2 text-red-500 font-medium text-[18px]">*</span></label>
          <input type="time" id="appt" name="appt" class="border-[1px] border-solid border-grey rounded-[6px] py-1.5 px-2">
        </div> -->
        <span class="w-[30%] pb-1 sm:w-[30%] md:w-[25%] lg:w-[25%] xl:w-[25%]">
          <TimePickerField name="appt" label="Time"> </TimePickerField>
        </span>
        <!-- <div class="flex flex-col justify-start items-center gap-2 font-medium">
          <label for="appt" class="pb-[1px] text-gray-700 w-[70%]" :class="(errors.appt) ? 'text-red-500' : ''">
            Time <span class="pb-2 text-red-500 font-medium text-[18px]">*</span>
          </label>
          <input v-model="timeField" type="time" id="appt" :class="[
            'border-[1px] border-solid rounded-[6px] py-[8px] px-2 font-normal text-[14px]',
          ]">
          <p v-if="errors.appt" class="text-red-500 text-[13px]">{{ errors.appt }}</p>
        </div> -->
        <!-- <SelectField name="type" label="Contact Method" placeholder="Select typ.." class="w-full" :options="[
          {
            value: 'voice',
            label: 'Voice',
          }, {
            value: 'whatsapp',
            label: 'Whatsapp',
          },
        ]" required /> -->
      </div>
      <div>
        <SelectField
          name="type"
          label="Contact Method"
          placeholder="Select type"
          class="w-full"
          :options="[
            {
              value: 'voice',
              label: 'Voice',
            },
            {
              value: 'whatsapp',
              label: 'Whatsapp',
            },
          ]"
          required
        />
      </div>
      <div
        v-if="values.type ? values.type === 'voice' : true"
        class="flex gap-2"
      >
        <CountryCodeField
          class="w-[100px]"
          name="countryCode"
          label="Country Code"
          helperText="Enter your country code"
          required
        />
        <TextField
          :disableCharacters="true"
          name="exoPhone"
          label="Mobile number"
          helperText=""
          required
          placeholder="Enter your mobile number"
        />
      </div>
      <SelectField
        name="audienceBucket"
        label="Select Audience List"
        placeholder="Select Audience"
        :options="campaignListWithLabels"
        required
      />
      <SelectField
        v-if="values.type === 'whatsapp'"
        label="Template"
        helperText="This template will be send via this campaign"
        name="templateId"
        :multiple="false"
        :required="true"
        placeholder="Select your template"
        :options="
          templateData?.map((integration: any) => ({
            label: integration.name,
            value: integration.id,
          }))
        "
      />

      <div class="flex w-full justify-end">
        <UiButton
          type="submit"
          class="mt-2"
          color="primary"
          :loading="isLoading"
        >
          Submit
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
