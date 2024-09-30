<template>
  <DialogWrapper v-model="modalState" :title="'Channel Configuration'">
    <form @submit="handleCreateEditBotChannel">


      <SelectField label="integration" helperText="Select your integration" name="integrationId" :multiple="false"
        :required="true" placeholder="Select your integration"
        :options="integrationsData?.map((integration: any) => ({ label: integration.name, value: integration.id }))" />
      <!-- <SelectField v-if="values.integrationId" label="template" helperText="Select your template" name="templateId"
        placeholder="Select your template"
        :options="templates?.map((template: string) => ({ label: template, value: template }))" />

      <SelectField v-if="values.integrationId" label="phone" helperText="Select your phone" name="phoneId"
        placeholder="Select your phone" :options="phoneNumbers" /> -->

      <div class="flex w-full justify-items-end">
        <UiButton color="primary" type="submit">
          Submit
        </UiButton>
      </div>
      <span class="text-sm text-gray-500">enter this webhook url in Meta Dashboard</span>
    </form>
  </DialogWrapper>
</template>

<script setup lang="ts">

const emit = defineEmits(["success"]);

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
  })
);

const { handleSubmit, defineField, errors, values, handleReset, setFieldValue } = useForm({
  validationSchema: formSchema
});


watch(
  () => modalState.value,
  async (value) => {
    handleReset();

    if (!value.id) return;
    const botDetails = await $fetch<{ channels: { whatsapp: string } }>(
      `/api/bots/${value.id}`,
    );
    if (typeof botDetails?.channels?.whatsapp === "string" && botDetails?.channels?.whatsapp)
      setFieldValue("integrationId", botDetails.channels?.whatsapp);
    // setFieldValue("link", intentDetails?.link);
  },
  { deep: true },
);
watch(errors, (newValues) => {
  console.log(newValues)
})
const handleCreateEditBotChannel = handleSubmit(async (values) => {
  console.log({ values })
  await $fetch(`/api/bots/${route.params.id}`, {
    method: "PUT",
    body: {
      channels: {
        whatsapp: values.integrationId
      },
    },
  });
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
