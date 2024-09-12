<script setup lang="ts">
import countryData from '~/assets/country-codes.json'
import { useRoute } from "vue-router";

definePageMeta({
  middleware: "admin-only",
});
const emit = defineEmits<{ (e: "confirm"): void }>();

interface Props {
  id: string;
}
const props = withDefaults(defineProps<Props>(), {
  id: "",
});
const route = useRoute();
const queryId = ref(route.params.id)
const bucketModalState = defineModel<{ open: boolean, id: null }>({
  default: {
    open: false,
    id: null,
  },
});


const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/
const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string()
      .min(1, 'Phone Number is required')
      .regex(phoneNumberPattern, 'Invalid phone number'),
    countryCode: z.string().min(1, 'Code is required'),
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
  initialValues: {
    // firstName: "",
    // lastName: "",
    // phone: "",
    // countryCode: "",
  },
});


const allCoutryDialCode = computed(() =>
  countryData?.map((country) => country.dial_code),
);
const {
  list: countyDialCodes,
  containerProps,
  wrapperProps,
  resetForm,
} = useVirtualList(allCoutryDialCode, {
  itemHeight: 32,
});
const [firstNameField, firstNameFieldProps] = defineField("firstName");
const [lastNameField, lastNameFieldProps] = defineField("lastName");
const [mobileField, mobileFieldProps] = defineField("phone");
const [countryCode, countryCodeProps] = defineField("countryCode");

watch(() => bucketModalState.value.open, async (newState) => { 
  if (queryId.value) {
    const getSingleDetails: any = await $fetch(`/api/org/campaign/${props.id}`)
      setFieldValue("firstName", getSingleDetails.firstName);
      setFieldValue("lastName", getSingleDetails.lastName);
      setFieldValue("countryCode", getSingleDetails.countryCode);
      setFieldValue("phone", getSingleDetails.phone);
  }
  console.log(bucketModalState, "bucketModalState")
});

const handleConnect = handleSubmit(async (values: any) => {
  try {
    if (props.id) {
      await $fetch(`/api/org/contact-list/${queryId.value}/contacts/${bucketModalState.value.id}`, { method: "PUT", body: values });
      toast.success("Created successfully")
    } else {
      await $fetch(`/api/org/contact-list/${queryId.value}/contacts`, { method: "POST", body: values });
      toast.success("Updated successfully")
    }
    emit('confirm')
  } catch(error: any) {
    toast.error(error.data.statusMessage)
  }
});
</script>
<template>
  <DialogWrapper v-model="bucketModalState" title="Add Bucket">
    <!-- :validation-schema="formSchema" -->
    <UiForm v-slot="{ values }" @submit="handleConnect" :keep-values="true" :validate-on-mount="false"
      class="space-y-2">
      <div class="flex gap-4">
        <UiFormField v-model="firstNameField" v-bind="firstNameFieldProps" name="firstName">
          <UiFormItem class="w-full">
            <UiFormLabel :class="errors?.firstName ? 'text-[#ef4444]' : ''">First Name <UiLabel
                class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-model="firstNameField" v-bind="firstNameFieldProps" type="text"
                placeholder="Enter first name" />
              <!-- :class="errors?.firstNameField ? 'border-red-700' : ''" -->
            </UiFormControl>
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.firstName }}</p>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-model="lastNameField" v-bind="lastNameFieldProps" name="lastName">
          <UiFormItem class="w-full">
            <UiFormLabel :class="errors?.lastName ? 'text-[#ef4444]' : ''">Last Name <UiLabel
                class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-model="lastNameField" v-bind="lastNameFieldProps" type="text" placeholder="Enter last name" />
            </UiFormControl>
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.lastName }}</p>
            <UiFormMessage />
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
        <UiFormField class="w-[80%]" v-model="mobileField" v-bind="mobileFieldProps" name="phone">
          <UiFormItem class="w-full">
            <UiFormLabel :class="errors?.firstName ? 'text-[#ef4444]' : ''">
              Phone Number <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-model="mobileField" v-bind="mobileFieldProps" placeholder="Enter phone number" />
            </UiFormControl>
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.phone }}</p>
            <!-- <UiFormMessage :error="errors.phone" /> -->
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