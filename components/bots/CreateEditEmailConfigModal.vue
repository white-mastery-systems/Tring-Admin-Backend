<template>
  <DialogWrapper v-model="modalState" :title="modalProps?.id ? `Edit Email Config` : 'Add Email Config'">
    <div>
      <form @submit.prevent="handleAddEmailConfig" class="space-y-6">
        <div class="space-y-3">
          <FieldArray name="emailRecipients" v-slot="{ fields, push, remove }">
            <div v-if="fields.length" class="space-y-2">
              <!-- Loop through the fields (emailRecipients) -->
              <fieldset v-for="(email, index) in fields" :key="email.key">
                <div :class="['flex gap-2', ((values.emailRecipients[index]) ? 'items-end' : 'items-center')]">
                  <TextField :label="`Email`" :id="`email_config_${index}`" :name="`emailRecipients[${index}]`"
                    placeholder="Enter Email." required />
                  <!-- Button to remove the email -->
                  <span :class="['flex items-end', (values.emailRecipients[index]) ? '' : 'mt-3']">
                    <UiButton variant="outline" type="button" @click="remove(index)">
                      <CloseIcon class="w-4 h-4" />
                    </UiButton>
                  </span>
                </div>
              </fieldset>
            </div>

            <!-- Button to add a new email recipient -->
            <div class="flex w-full justify-end gap-2 mb-3">
              <UiButton color="primary" type="submit" size="lg" @click="push('')">Add Email</UiButton>
            </div>
          </FieldArray>
        </div>
        <div class="flex w-full justify-end gap-2">
          <UiButton color="primary" type="submit" size="lg" :loading="isLoading">
            Submit
          </UiButton>
        </div>
      </form>
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { FieldArray } from "vee-validate";
import CloseIcon from "~/components/icons/CloseIcon.vue";

const modalState = defineModel<{ open: boolean, resObject: object }>({
  default: { open: false, resObject: {} },
  required: true,
});
const emit = defineEmits(["success"]);
const isLoading = ref(false);
const modalProps = defineProps<{ id: any }>();

const emailConfigSchema = toTypedSchema(
  z.object({
    emailRecipients: z.array(z.string().email()), // Ensure email validation
  })
);

const { setFieldValue, values, handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: emailConfigSchema,
  initialValues: { emailRecipients: [] }, // Initialize with an empty array
});

watch(
  () => modalState.value.resObject.emailRecipients,
  (newRecipients) => {
    setFieldValue("emailRecipients", newRecipients || []);
  },
  { immediate: true } // Trigger immediately for initial load
);


const handleAddEmailConfig = handleSubmit(async (values: any) => {
  const payload = {
    ...modalState.value.resObject,
    emailRecipients: values.emailRecipients
  }
  await updateEmailConfig(payload)
  emit("success")
});
</script>
