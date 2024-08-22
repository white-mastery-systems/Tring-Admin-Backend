<template>
  <UiDialog v-model:open="modalState.open">
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader>
        <UiDialogTitle>Link CRM</UiDialogTitle>
      </UiDialogHeader>
      <UiForm
        v-slot="{ values, errors }"
        :validation-schema="CRMConfigSchema"
        @submit="handleAddIntegration"
        class="space-y-2"
      >
        <UiFormField v-slot="{ componentField }" name="integrationId">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Select Connected CRM<UiLabel class="text-lg text-red-500"
                >*</UiLabel
              >
            </UiFormLabel>
            <UiFormControl>
              <UiSelect
                v-bind="componentField"
                @update:model-value="handleCrmChange"
              >
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select CRM" />
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
            <UiFormMessage />
            <span class="text-xs text-gray-500">Select your crm.</span>
          </UiFormItem>
        </UiFormField>

        <UiFormField
          v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'zoho-bigin'
          "
          v-slot="{ componentField }"
          name="pipelineId"
        >
          <UiFormItem class="w-full">
            <UiFormLabel
              >Select Pipeline<UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect
                v-bind="componentField"
                @update:model-value="handleCrmChange"
              >
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select Pipeline" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="(integrationData, index) in pipelines"
                    :value="integrationData.Pipeline.id"
                    >{{ integrationData.Sub_Pipeline }}</UiSelectItem
                  >
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500">Select your pipeline.</span>
          </UiFormItem>
        </UiFormField>
        <UiFormField
          v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'sell-do'
          "
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
          v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'sell-do'
          "
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
  const emit = defineEmits(["success"]);
  let pipelines = ref([]);
  const modalState = defineModel<any>({
    default: { open: false },
    required: true,
  });
  const handleCrmChange = async (e: any) => {
    const matchedCRM: any = integrationsData?.value?.find(
      (integration: any) => {
        if (integration.id === e) {
          console.log({ integration });
          return integration;
        }
      },
    );
    console.log({ matchedCRM });
    if (matchedCRM.crm === "zoho-bigin") {
      const data: any = await $fetch(
        `/api/org/integrations/zoho-bigin/pipelines?id=${matchedCRM.id}`,
      );
      console.log({ data: data.layouts });
      pipelines.value = data.data;
    }
  };
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
    const pipelineObj = pipelines.value.find(
      (pipeline) => pipeline.Pipeline.id === value.pipelineId,
    );
    addBotIntegration({
      payload: { ...value, botId: route.params.id, pipelineObj },
      onSuccess: () => {
        emit("success");
      },
    });
  };
  const CRMConfigSchema = toTypedSchema(
    z.object({
      integrationId: z.string().min(1, { message: "CRM is required" }),
      campaignId: z.string().optional(),
      projectId: z.string().optional(),
      pipelineId: z.string().optional(),
    }),
  );
</script>
