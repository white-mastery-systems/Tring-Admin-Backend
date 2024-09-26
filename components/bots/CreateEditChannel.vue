<template>
  <DialogWrapper v-model="modalState" :title="'Channel Configuration'">
    <form @submit="handleCreateEditBotChannel()">


      <SelectField label="integration" helperText="Select your integration" name="integrationId" :multiple="false"
        :required="true" placeholder="Select your integration"
        :options="integrationsData?.map((integration: any) => ({ label: integration.name, value: integration.id }))" />
      <!-- <SelectField v-if="values.integrationId" label="template" helperText="Select your template" name="templateId"
        placeholder="Select your template"
        :options="templates?.map((template: string) => ({ label: template, value: template }))" />

      <SelectField v-if="values.integrationId" label="phone" helperText="Select your phone" name="phoneId"
        placeholder="Select your phone" :options="phoneNumbers" /> -->

      <div class="flex w-full items-end">
        <UiButton color="primary" type="submit">
          <CopyIcon class="mr-2 h-4 w-4" />Submit and copy webhook url
        </UiButton>
      </div>
      <span class="text-sm text-gray-500">enter this webhook url in Meta Dashboard</span>
    </form>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { CopyIcon } from "lucide-vue-next";

const emit = defineEmits(["success"]);
const { copy } = useClipboard();

const modalState = defineModel<{ open: boolean; id: string | null }>({
  default: { open: false, id: null },
  required: true,
});
const route = useRoute("bot-management-chat-bot-id");
const channels = [
  {
    label: "Whatsapp",
    value: "whatsapp",
  },
];
const formSchema = toTypedSchema(
  z.object({
    integrationId: z.string({ required_error: "IntegrationId is required" }).min(1, 'IntegrationId is required'),
    templateId: z.string({ required_error: "template is required" }).min(1, "template is required"),
    phoneId: z.string({ required_error: "phone is required" }).min(1, "phone is required")

  })
);

const { handleSubmit, defineField, errors, values } = useForm({
  validationSchema: formSchema
});

const handleCreateEditBotChannel = handleSubmit(async (values) => {
  await $fetch(`/api/bots/${route.params.id}`, {
    method: "PUT",
    body: {
      channels: {
        whatsapp: values.integrationId
      },
    },
  });
  copy(`https://app.tringlabs.ai/whatsapp?botId=${route.params.id}`);
  emit("success");
});
const {
  status: integrationLoadingStatus,
  data: integrationsData,
  refresh: integrationRefresh,
} = await useLazyFetch("/api/org/integrations?q=channel", {
  server: false,
  default: () => [],
});
</script>
