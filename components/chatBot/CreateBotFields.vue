<template>
  <form @submit.prevent="handleAddEditBot" class="flex gap-2">
    <TextField label="Bot Name" name="name" placeholder="enter your bot name" required>
    </TextField>
    <SelectField name="type" label="Bot Type " placeholder="Select Type" :options="botTypes" :required="true"  />
    <SelectField v-if="values.type === 'ecommerce'" name="integrationId" :multiple="false" label="Select Integration"
      placeholder="Select Integration" :options="integrationsData.map((integration) => ({
          value: integration.id,
          label: integration.name,
        }))
          " />
  </form>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { botTypes } from '~/composables/botManagement/chatBot/useBotType'
definePageMeta({
  middleware: "admin-only",
});

const emit = defineEmits<{ (e: "confirm", values: any): void }>();
const route = useRoute();
const queryId = ref(route.params?.id);
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: "Bot name is required" })
      .min(2, "Bot Name is required"),
    type: z.string({ required_error: "Bot type is required" }),
    integrationId: z.string().optional(), // Always optional
  }).superRefine((data, ctx) => {
    if (data.type === "ecommerce" && !data.integrationId) {
      ctx.addIssue({
        path: ["integrationId"],
        message: "Integration ID is required for E-Commerce type.",
      })
    }
  })
);

const { handleSubmit, setFieldValue, resetForm, values, errors } = useForm({
  validationSchema: formSchema,
});

const handleAddEditBot = handleSubmit(async (values) => {
  isLoading.value = true;
  emit("confirm", values);
  isLoading.value = false;
});
defineExpose({ handleAddEditBot, values, errors });
const {
  status: integrationLoadingStatus,
  data: integrationsData,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations", {
  server: false,
  query: {
    q: "ecommerce",
  },
  default: () => [],
});
</script>