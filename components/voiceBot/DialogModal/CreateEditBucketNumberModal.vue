<script setup lang="ts">
// import countryData from '~/assets/country-codes.json'
import { useRoute } from "vue-router";

definePageMeta({
  middleware: "admin-only",
});
const emit = defineEmits<{ (e: "confirm"): void }>();


const route = useRoute();
const queryId = ref(route.params.id)
const bucketModalState = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const isLoading = ref(false)

const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/
const formSchema = toTypedSchema(
  z.object({
    firstName: z.string({ required_error: 'First name is required' }).min(1, 'First name is required'),
    lastName: z.string({ required_error: 'Last name is required' }).min(1, 'Last name is required'),
    phone: z.string({ required_error: 'Mobile Number is required' }),
    countryCode: z.string({ required_error: 'Code is required' }).min(1, 'Code is required'),
    email: z.string().optional(),
    // addBuckets: z.string().min(1, "Add Audiences is required")
  }).superRefine((data, ctx) => {
    const lengthRequirement = getCountryLengthRequirement(data.countryCode);
    if (data.phone.length !== lengthRequirement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Number must be exactly ${lengthRequirement} characters long.`,
        path: ["phone"], // Field with the issue
      });
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


// const allCoutryDialCode = computed(() =>
//   countryData?.map((country) => country.dial_code),
// );
// const {
//   list: countyDialCodes,
//   containerProps,
//   wrapperProps,
// } = useVirtualList(allCoutryDialCode, {
//   itemHeight: 32,
// });
// const [firstNameField, firstNameFieldProps] = defineField("firstName");
// const [lastNameField, lastNameFieldProps] = defineField("lastName");
// const [mobileField, mobileFieldProps] = defineField("phone");
// const [countryCode, countryCodeProps] = defineField("countryCode");

watch(() => bucketModalState.value.open, async (newState) => { 
  resetForm()
  if (bucketModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/org/contacts/${bucketModalState.value.id}`)
      setFieldValue("firstName", getSingleDetails.firstName);
      setFieldValue("lastName", getSingleDetails.lastName);
      setFieldValue("countryCode", getSingleDetails.countryCode);
      setFieldValue("phone", getSingleDetails.phone);
      setFieldValue("email", getSingleDetails.email);
  }
});

const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true
  try {
    if (bucketModalState.value.id) {
      await $fetch(`/api/org/contacts/${bucketModalState.value.id}`, { method: "PUT", body: values });
      toast.success("Updated successfully")
    } else {
      await $fetch(`/api/org/contacts`, { method: "POST", body: values });
      toast.success("Created successfully")
    }
    resetForm()
    emit('confirm')
  } catch(error: any) {
    isLoading.value = false
    toast.error(error.data.statusMessage)
  }
  isLoading.value = false
});
</script>
<template>
  <DialogWrapper v-model="bucketModalState" :title="(bucketModalState.id) ? 'Modify Contact' : 'Add Contact'">
    <!-- :validation-schema="formSchema" -->
    <form @submit="handleConnect" class="space-y-3">
      <div class="flex gap-4">
        <TextField name="firstName" label="First Name" placeholder="Enter first name" required>
        </TextField>
        <TextField name="lastName" label="Last Name" placeholder="Enter last name" required>
        </TextField>
      </div>
      <!-- {{ countryList }} || sdf -->
      <div class='flex gap-2'>
        <CountryCodeField class='w-[100px]' name="countryCode" label="Country Code" helperText="Enter your country code"
        required />
        <TextField :disableCharacters="true" name="phone" label="Mobile number" helperText='' required
        placeholder="Enter your mobile number" />
      </div>
      <TextField type="email" name="email" label="Email" helperText='' placeholder="Enter your Email" />

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
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>