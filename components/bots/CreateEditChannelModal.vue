<template>
  <DialogWrapper v-model="modalState" :title="'Channel Configuration'">
    <form @submit="handleCreateEditBotChannel">
      <SelectField label="Integration" helperText="Select your integration" name="integrationId" :multiple="false"
        placeholder="Select your integration"
        :options="integrationsData?.map((integration: any) => ({ label: integration.name, value: integration.id }))"
        :closeIcon="true" />
      <!-- <SelectField v-if="values.integrationId" label="template" helperText="Select your template" name="templateId"
        placeholder="Select your template"
        :options="templates?.map((template: string) => ({ label: template, value: template }))" />

      <SelectField v-if="values.integrationId" label="phone" helperText="Select your phone" name="phoneId"
        placeholder="Select your phone" :options="phoneNumbers" /> -->
      <div class="flex items-center space-x-2 my-4">
        <UiSwitch :checked="showButtons" id="show-button" @update:checked="handleShowButton" />
        <UiLabel for="show-button">Show Buttons</UiLabel>
      </div>

      <div class="flex w-full justify-items-end">
        <UiButton type="submit" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
      <span class="text-sm text-gray-500">Enter this webhook url in Meta Dashboard</span>
    </form>
  </DialogWrapper>
</template>

<script setup lang="ts">

const emit = defineEmits(["success"]);
const showButtons = ref(false)
function handleShowButton(value: boolean) {
  showButtons.value = value
}
const isLoading = ref(false)
const modalState = defineModel<{ open: boolean; id: string | null }>({
  default: { open: false, id: null },
  required: true,
});
const route = useRoute("chat-bot-id");
const channels = [
  {
    label: "Whatsapp",
    value: "whatsapp",
  },
];
const formSchema = toTypedSchema(
  z.object({
    integrationId: z.string().optional(),
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
    const botDetails = await $fetch<{ channels: { whatsapp: string }, metadata: { showButtons: boolean } }>(
      `/api/bots/${value.id}`,
    );
    if (typeof botDetails?.channels?.whatsapp === "string" && botDetails?.channels?.whatsapp) {
      setFieldValue("integrationId", botDetails.channels?.whatsapp);
    }
    if (botDetails?.metadata) {
      showButtons.value = !!botDetails?.metadata?.showButtons
    }
    // setFieldValue("link", intentDetails?.link);
  },
  { deep: true },
);
const handleCreateEditBotChannel = handleSubmit(async (values) => {
  isLoading.value = true
  await $fetch(`/api/bots/${route.params.id}`, {
    method: "PUT",
    body: {
      channels: {
        whatsapp: values.integrationId
      },
      metadata: {
        showButtons: showButtons.value
      }
    },
  });
  emit("success");
  isLoading.value = false
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
