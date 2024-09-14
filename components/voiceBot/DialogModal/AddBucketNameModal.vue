<script setup lang="ts">
// import countryData from '~/assets/country-codes.json'

definePageMeta({
  middleware: "admin-only",
});

const emit = defineEmits<{ (e: "confirm"): void }>();
const addBucketNameModalState = defineModel<{ open: boolean, id: any }>({
  default: {
    open: false,
    id: "",
  },
});

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'First is required'),
    // lastName: z.string().min(1, 'LastName is required'),
  })
);
watch(() => addBucketNameModalState.value.open, async(newState) => {
  if (addBucketNameModalState.value.id) {
    const getSingleDetails: any = await $fetch(`/api/org/contact-list/${addBucketNameModalState.value.id}`)
    setFieldValue("name", getSingleDetails.name)
  } else {
    resetForm()
  }
});


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


const [nameField, nameFieldProps] = defineField("name")

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
watch(addBucketNameModalState, (newState) => { });


// const addVoiceBot = async (value: any) => {
//   try {
//     const bot = await $fetch("/api/voicebots", {
//       method: "POST",
//       body: { name: value.newBotName },
//     });
//     return navigateTo({
//       name: "bot-management-voice-bot-id",
//       params: { id: bot.id },
//     });
//   } catch (err: any) {
//     toast.error(err.data.data[0].message);
//   }
// };


const handleConnect = handleSubmit(async (values: any) => {
  try {
    if (addBucketNameModalState.value.id) {
      const getUpdateValues = await $fetch(`api/org/contact-list/${addBucketNameModalState.value.id}`, { method: "PUT", body: values });
      toast.success("Updated successfully")
    } else {
      
      await $fetch("/api/org/contact-list", { method: "POST", body: values });
      toast.success("Created successfully")
    }
    emit('confirm')
  } catch(error: any) {
    toast.error(error.data.statusMessage)
  }
});
</script>
<template>
  <DialogWrapper v-model="addBucketNameModalState"
    :title="(addBucketNameModalState.id) ?  'Modify Bucket' : 'Add Bucket'" class="rounded-lg">
    <UiForm v-slot="{ values }" @submit="handleConnect" :keep-values="true" :validate-on-mount="false"
      class="space-y-2">
      <div class="flex gap-4">
        <UiFormField v-model="nameField" v-bind="nameFieldProps" name="name">
          <UiFormItem class="w-full">
            <UiFormLabel>Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput v-model="nameField" v-bind="nameFieldProps" type="text" placeholder="Enter Name" />
              <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.name }}</p>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>
      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>
    </UiForm>
  </DialogWrapper>
</template>