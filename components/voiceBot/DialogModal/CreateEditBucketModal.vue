<template>
  <DialogWrapper v-model="addBucketNameModalState" :title="addBucketNameModalState?.id ? 'Modify Bucket' : 'Add Bucket'"
    class="rounded-lg">
    <form @submit="handleConnect" class="space-y-4">
      <TextField name="name" label="Name" placeholder="Enter name" required>
      </TextField>
      <SelectField v-if="!addBucketNameModalState.id" name="type" label="Select Bot Type"
        placeholder="Select bot type" :options="[
          {
            value: 'chat',
            label: 'Chat',
          }, {
            value: 'voice',
            label: 'Voice',
          },
        ]" required />
      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const getSingleDetails = ref()

const {
  status,
  data: contactsList,
  refresh: integrationRefresh,
} = await useLazyFetch(`/api/org/contacts`, {
  server: false,
  default: () => [],
  transform: (contacts: any) => {
    return contacts.map((contact: any) => ({
      value: contact.id,
      name: `${contact.countryCode} ${contact.phone}`,
    }));
  },
});
// Local state to hold the selected values

const emit = defineEmits<{ (e: "confirm"): void }>();
const addBucketNameModalState = defineModel<{ open: boolean; id: any }>({
  default: {
    open: false,
    id: "",
  },
});
const isLoading = ref(false);

const filteredContactsList = computed(() => {
  return contactsList.value; // Return contactsList or any filtered version of it
});

const bucketSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name is required"),
    type: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Check if `type` is not empty and additional conditions apply
    if (data.type === undefined && addBucketNameModalState.value.id === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A valid ID is required when type is provided",
        path: ["type"], // Highlight the "type" field
      })
    }
  }))

watch(
  () => addBucketNameModalState.value.open,
  async (newState) => {
    if (newState) { // Only perform fetch when opening
      resetForm()
      if (addBucketNameModalState.value.id) {
        getSingleDetails.value = await $fetch(
          `/api/org/contact-list/${addBucketNameModalState.value.id}`
        );
        setFieldValue("name", getSingleDetails.value.name);
      }
    }
  }
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
  validationSchema: bucketSchema,
});

const [nameField, nameFieldProps] = defineField("name");

const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true;
  try {
    if (addBucketNameModalState.value.id) {
      $fetch("/api/org/contact-list/" + addBucketNameModalState.value.id, {
        method: "PUT",
        body: values,
      });

      // const getUpdateValues = await $fetch(`api/org/contact-list/${addBucketNameModalState.value.id}`, { method: "PUT", body: values });
      toast.success("Updated successfully");
    } else {
      await $fetch("/api/org/contact-list", { method: "POST", body: values });
      toast.success("Created successfully");
      await navigateTo({
        name: 'contacts-management-buckets',
      });
    }
    emit("confirm");
  } catch (error: any) {
    toast.error(error.data.statusMessage);
    isLoading.value = false;
  }
  isLoading.value = false;
});
</script>
<style scoped>
.multiselect__content {
  z-index: 9999;
  /* Ensure this is higher than the DialogWrapper */
}
</style>