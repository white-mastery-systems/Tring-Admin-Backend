<script setup lang="ts">
import countryData from '~/assets/country-codes.json'

definePageMeta({
  middleware: "admin-only",
});

const bucketModalState = defineModel<{ open: boolean }>({
  default: {
    open: false,
  },
});

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/
const formSchema = toTypedSchema(
  z.object({
    firstName:z.string().min(1, 'First is required'),
    lastName: z.string().min(1, 'LastName is required'),
    exoPhone: z.string()
      .min(1, 'Phone Number is required')
      .regex(phoneNumberPattern, 'Invalid phone number'),
    countryCode: z.string().min(1, 'Country Code is required'),
    // addBuckets: z.string().min(1, "Add Audiences is required")
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
const [mobileField, mobileFieldProps] = defineField("exoPhone");
const [countryCode, countryCodeProps] = defineField("countryCode");

watch(bucketModalState, (newState) => { });


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
  await $fetch("/api/org/integrations/number-integration", { method: "POST", body: payload });
  // emit("success")
};
</script>
<template>
  <DialogWrapper v-model="bucketModalState" title="Add Bucket">
    <UiForm v-slot="{ values }" :validation-schema="formSchema" @submit="handleConnect" :keep-values="true"
      :validate-on-mount="false" class="space-y-2">
      <div class="flex gap-4">
        <UiFormField v-slot="{ componentField }" name="firstName">
          <UiFormItem class="w-full">
            <UiFormLabel>First Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter first name" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="lastName">
          <UiFormItem class="w-full">
            <UiFormLabel>Last Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-bind="componentField" type="text" placeholder="Enter last name" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
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
      <!-- <UiFormField v-slot="{ componentField }" name="addBuckets">
        <UiFormItem class="w-full">
          <UiFormLabel>Add Audiences for Buckets in Bulk <UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiInput v-bind="componentField" type="text" placeholder="Enter audience names" />
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