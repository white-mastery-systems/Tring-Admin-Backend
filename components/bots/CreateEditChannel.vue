<template>
  <DialogWrapper v-model="modalState" :title="'Channel Configuration'">
    <UiForm @submit="handleCreateEditBotChannel()">
      <!-- <UiFormField
        v-model="channelField"
        v-bind="channelFieldAttrs"
        name="channel"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Connected channel<UiLabel class="text-lg text-red-500"
              >*</UiLabel
            >
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="channelField" v-bind="channelFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select CRM" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="(integrationData, index) in channels"
                  :value="integrationData.value"
                  >{{ integrationData.label }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <template v-if="errors?.channel">
            <span class="text-sm text-red-500">{{ errors?.channel }}</span>
            <br />
          </template>
          <span class="text-xs text-gray-500">Select your crm.</span>
        </UiFormItem>
      </UiFormField> -->

      <UiFormField
        v-model="integrationField"
        v-bind="integrationFieldAttrs"
        name="integrationId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Connected channel<UiLabel class="text-lg text-red-500"
              >*</UiLabel
            >
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="integrationField" v-bind="integrationFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select integration" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="(integrationData, index) in integrationsData"
                  :value="integrationData.id"
                  >{{ integrationData.name }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <!-- <UiFormMessage /> -->
          <template v-if="errors?.integrationId">
            <span class="text-sm text-red-500">{{
              errors?.integrationId
            }}</span>
            <br />
          </template>
          <span class="text-xs text-gray-500">Select your integration.</span>
        </UiFormItem>
      </UiFormField>
      <div class="flex w-full items-end">
        <UiButton color="primary" type="submit"
          >Submit and copy webhook url</UiButton
        >
      </div>
      <span class="text-sm text-gray-500"
        >enter this webhook url in meta dashboard</span
      >
    </UiForm>
  </DialogWrapper>
</template>

<script setup lang="ts">
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
  const { handleSubmit, defineField, errors } = useForm();
  const [channelField, channelFieldAttrs] = defineField("channel");
  const [integrationField, integrationFieldAttrs] =
    defineField("integrationId");

  const handleCreateEditBotChannel = handleSubmit(async (values) => {
    await $fetch(`/api/bots/${route.params.id}`, {
      method: "PUT",
      body: {
        channels: {
          whatsapp: {
            id: values.integrationId,
            // crm: data?.crm,
          },
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
