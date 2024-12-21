<template>
  <DialogWrapper v-model="bucketModalState"
    :title="(bucketModalState.id) ? `Modify ${props.botType} Contact` : `Add ${props.botType} Contact`"
    class="capitalize">
    <!-- :validation-schema="formSchema" -->
    <form @submit="handleConnect" class="space-y-3">
      <div v-if="props.botType === 'chat'" class="flex gap-4">
        <TextField name="firstName" label="First Name" placeholder="Enter first name" required>
        </TextField>
        <TextField name="lastName" label="Last Name" placeholder="Enter last name" required>
        </TextField>
      </div>
      <div v-if="props.botType === 'voice'" class="flex gap-4">
        <TextField name="name" label="Name" placeholder="Enter name" required>
        </TextField>
        <TextField name="metadata" label="MetaData" placeholder="Enter MetaData" required>
        </TextField>
      </div>
      <!-- {{ countryList }} || sdf -->
      <div class='flex gap-2'>
        <CountryCodeField class='w-[100px]' name="countryCode" label="Country Code" helperText="Enter your country code"
          required />
        <TextField :disableCharacters="true" name="phone" label="Mobile number" helperText='' required
          placeholder="Enter your mobile number" />
      </div>
      <TextField v-if="props.botType === 'chat'" type="email" name="email" label="Email" helperText=''
        placeholder="Enter your Email" />
      <TextField v-if="props.botType === 'voice'" name="verificationId" label="Verification Id"
        placeholder="Enter verification id" required>
      </TextField>

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
      email: z.string().optional(),
      name: z.string().optional(),
      metadata: z.string().optional(),
      verificationId: z.string().optional(),
      phone: z.string({ required_error: 'Mobile Number is required' }).optional(),
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
        if (!data.lastName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Last name is required for chatBot.",
            path: ["lastName"],
          });
        }
        if (data.email && !data.email.includes("@")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid email format.",
            path: ["email"],
          });
        }
      } else if (props.botType === "voice") {
        if (!data.name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Name is required for voiceBot.",
            path: ["name"],
          });
        }
        if (!data.metadata) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Metadata is required for voiceBot.",
            path: ["metadata"],
          });
        }
        if (!data.verificationId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Verification ID is required for voiceBot.",
            path: ["verificationId"],
          });
        }

        // if (!data.phone) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: "Phone number is required for voiceBot.",
        //     path: ["phone"],
        //   });
        // } else {
        //   const lengthRequirement = getCountryLengthRequirement(data.countryCode);
        //   if (data.phone.length !== lengthRequirement) {
        //     ctx.addIssue({
        //       code: z.ZodIssueCode.custom,
        //       message: `Phone number must be exactly ${lengthRequirement} characters long.`,
        //       path: ["phone"],
        //     });
        //   }
        // }
        // if (!data.countryCode) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: "Country code is required for voiceBot.",
        //     path: ["countryCode"],
        //   });
        // }
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
        await $fetch(`/api/org/contact-list/${queryId.value}`, {
        method: "PUT",
        body: values,
      });
    } else {
        await $fetch(`/api/org/contacts/${queryId.value}`, {
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
      // if (props.typeOfAddContacts === "insideBucket") await $fetch(`/api/org/contact-list/${route.params.id}`, { method: "POST", body: values });
      // else await $fetch(`/api/org/contacts?type=${props.botType ?? 'chat'}`, { method: "POST", body: values });
      // toast.success("Created successfully")
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