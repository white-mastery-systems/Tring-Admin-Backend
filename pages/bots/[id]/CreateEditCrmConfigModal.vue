<template>
  <UiDialog v-model:open="modalState.open">
    <!-- <UiDialogTrigger as-child>
      <UiButton variant="outline" color="primary"> Link Integration </UiButton>
    </UiDialogTrigger> -->
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader>
        <UiDialogTitle>Link CRM</UiDialogTitle>
      </UiDialogHeader>
      <UiForm
        v-slot="{ values }"
        :validation-schema="CRMConfigSchema"
        @submit="handleAddIntegration"
        class="space-y-2"
      >
        <UiFormField v-slot="{ componentField }" name="crm">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Select Connected CRM<UiLabel class="text-lg text-red-500"
                >*</UiLabel
              >
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select CRM" />
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
            <span class="text-xs text-gray-500">Select your crm.</span>
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-if="values.crm === 'sell-do'"
          v-slot="{ componentField }"
          name="campaignId"
        >
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
        <UiFormField
          v-if="values.crm === 'sell-do'"
          v-slot="{ componentField }"
          name="projectId"
        >
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
  const modalState = defineModel<any>({
    default: { open: false },
    required: true,
  });

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
    console.log({ value });
    modalState.value.open = false;

    // addBotIntegration({
    //   payload: { ...value, botId: route.params.id },
    //   onSuccess: () => {
    //     modalState.open.value = false;
    //   },
    // });
  };
  const CRMConfigSchema = toTypedSchema(
    z.object({
      crm: z.string().min(1, { message: "CRM is required" }),
      campaignId: z.string().min(1, { message: "Campaign ID is required" }),
      projectId: z.string().min(1, { message: "Project ID is required" }),
    }),
  );
</script>
