<template>
  <DialogWrapper v-model="bucketModalState"
    :title="(bucketModalState.id) ? `Modify ${props.botType} Contact` : `Add ${props.botType} Contact`"
    class="capitalize">
    <form @submit="handleConnect" class="space-y-3">
      <div v-if="props.botType === 'chat'" class="flex gap-4">
        <TextField name="firstName" label="First Name" placeholder="Enter first name" required>
        </TextField>
        <TextField name="lastName" label="Last Name" placeholder="Enter last name">
        </TextField>
      </div>
      <div v-if="props.botType === 'voice'" class="flex gap-4">
        <TextField name="name" label="Name" placeholder="Enter name" required>
        </TextField>
      </div>
      <div class='flex gap-2'>
        <CountryCodeField class='w-[150px]' name="countryCode" label="Country Code" helperText="Enter your country code"
          required />
        <TextField :disableCharacters="true" name="phone" label="Mobile number" helperText='' required
          placeholder="Enter your mobile number" />
      </div>
      <TextField v-if="props.botType === 'chat'" type="email" name="email" label="Email" helperText=''
        placeholder="Enter your Email" />
      <div v-if="props.botType === 'voice'" class="flex gap-4">
        <TextField name="metadata" label="MetaData" placeholder="Enter MetaData">
        </TextField>
        <TextField name="verificationId" label="Verification Id" placeholder="Enter verification id">
        </TextField>
      </div>

      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";

definePageMeta({
  middleware: "admin-only",
});
interface Props {
  botType: string;
  typeOfAddContacts: string;
}
const emit = defineEmits<{ (e: "confirm"): void }>();
const props = withDefaults(defineProps<Props>(), {
  botType: "chat",
  typeOfAddContacts: "",
});


const route = useRoute();
const queryId = ref(route.params.id)
const bucketModalState = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const isLoading = ref(false)

const formSchema = toTypedSchema(
  z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z
        .string({ required_error: "Email is required" })
        .optional(),
      name: z.string().optional(),
      metadata: z.string().optional(),
      verificationId: z.string().optional(),
      phone: z.string({ required_error: 'Mobile Number is required' }), // .optional()
      countryCode: z.string({ required_error: 'Code is required' }).min(1, 'Code is required'),
    })
    .superRefine((data, ctx) => {
      const lengthRequirement = getCountryLengthRequirement(data.countryCode);
      if (data.phone.length !== lengthRequirement) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Number must be exactly ${lengthRequirement} characters long.`,
          path: ["phone"], // Field with the issue
        })
      }
      if (props.botType === "chat") {
        if (!data.firstName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "First name is required for chatBot.",
            path: ["firstName"],
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

watch(() => bucketModalState.value.open, async (newState) => {
  resetForm()
  if (bucketModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/org/contacts/${bucketModalState.value.id}`, {
      params: {
        type: props.botType ?? 'chat',
      }
    })
    if (props.botType === 'chat') {
      setFieldValue("firstName", getSingleDetails.firstName ?? '');
      setFieldValue("lastName", getSingleDetails.lastName ?? '');
      setFieldValue("email", getSingleDetails.email ?? '');
    } else {
      setFieldValue("name", getSingleDetails.name ?? '');
      setFieldValue("metadata", getSingleDetails.metadata ?? '');
      setFieldValue("verificationId", getSingleDetails.verificationId ?? '');
    }
    setFieldValue("countryCode", getSingleDetails.countryCode ?? '');
    setFieldValue("phone", getSingleDetails.phone ?? '');
  }
});

const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true
  try {
    if (bucketModalState.value.id) {
      if (props.typeOfAddContacts === "insideBucket") {
        await $fetch(`/api/org/contact-list/${queryId.value ? queryId.value : bucketModalState.value.id}`, {
        method: "PUT",
        body: values,
      });
    } else {
        await $fetch(`/api/org/contacts/${queryId.value ? queryId.value : bucketModalState.value.id}`, {
          method: "PUT",
          body: values,
          params: {
            type: props.botType ?? 'chat', // Add your query parameter(s) here
          },
        });
    }
      toast.success("Updated successfully")
    } else {
      if (props.typeOfAddContacts === "insideBucket") {
        await $fetch(`/api/org/contact-list/${queryId.value}/contact`, {
          method: "POST",
          body: values,
        });
      } else {
        await $fetch(`/api/org/contacts?type=${props.botType ?? 'chat'}`, {
          method: "POST",
          body: values,
        });
      }
      toast.success("Created successfully");
    }
    resetForm()
    emit('confirm')
  } catch (error: any) {
    isLoading.value = false
    toast.error(error.data.statusMessage)
  }
  isLoading.value = false
});
</script>