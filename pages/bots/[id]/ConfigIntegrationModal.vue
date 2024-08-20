<template>
  <UiDialog v-model:open="isModalOpen">
    <!-- <UiDialogTrigger as-child>
      <UiButton variant="outline" color="primary"> Link Integration </UiButton>
    </UiDialogTrigger> -->
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader>
        <UiDialogTitle>Link Integration</UiDialogTitle>
      </UiDialogHeader>
      <UiForm @submit="handleAddIntegration" class="space-y-2">
        <UiFormField v-slot="{ componentField }" name="integration">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Select Connected Integation<UiLabel class="text-lg text-red-500"
                >*</UiLabel
              >
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select Integration" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="(integrationData, index) in integrationsData"
                    :value="integrationData.name"
                    >{{
                      integrationData.name === "sell-do"
                        ? "Sell Do"
                        : "Zoho Bigin"
                    }}</UiSelectItem
                  >
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500">Select your integration.</span>
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="campaignId">
          <UiFormItem class="w-full">
            <UiFormLabel class="font-bold">Campaign Id</UiFormLabel>
            <UiFormControl>
              <UiInput
                v-bind="componentField"
                type="text"
                placeholder="Enter your campaign id"
              />
            </UiFormControl>

            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="projectId">
          <UiFormItem class="w-full">
            <UiFormLabel class="font-bold">Project Id</UiFormLabel>
            <UiFormControl>
              <UiInput
                placeholder="Enter your project id"
                v-bind="componentField"
                type="text"
              />
            </UiFormControl>

            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiButton type="submit" class="mt-2" color="primary">
          Save changes
        </UiButton>
      </UiForm>
    </UiDialogContent>
  </UiDialog>
</template>
<script setup lang="ts">
  const isModalOpen = defineModel<boolean>({ default: false, required: true });

  const {
    status: integrationLoadingStatus,
    data: integrationsData,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations", {
    server: false,
    default: () => [],
  });
  console.log({ integrationsData });
  const route = useRoute("bots-id-crm-config");
  const handleAddIntegration = (value: any) => {
    addBotIntegration({
      payload: { ...value, botId: route.params.id },
      onSuccess: () => {
        isModalOpen.value = false;
      },
    });
  };
</script>
