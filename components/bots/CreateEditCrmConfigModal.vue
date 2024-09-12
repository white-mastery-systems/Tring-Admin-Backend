<template>
  <DialogWrapper
    v-model="modalState"
    :title="modalProps?.id ? `Edit CRM` : 'Link CRM'"
  >
    <UiForm @submit="handleAddIntegration" class="space-y-2">
      <UiFormField
        v-model="integrationField"
        v-bind="integrationFieldAttrs"
        name="integrationId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Connected CRM<UiLabel class="text-lg text-red-500"
              >*</UiLabel
            >
          </UiFormLabel>
          <UiFormControl>
            <UiSelect
              v-model="integrationField"
              v-bind="integrationFieldAttrs"
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
          <!-- <UiFormMessage /> -->
          <template v-if="errors?.integrationId">
            <span class="text-sm text-red-500">{{
              errors?.integrationId
            }}</span>
            <br />
          </template>
          <span class="text-xs text-gray-500">Select your crm.</span>
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-if="
          integrationsData.find(
            (integration) => integration.id === values.integrationId,
          )?.crm === 'zoho-bigin'
        "
        v-model="subPipelineField"
        v-bind="subPipelineFieldAttrs"
        name="subPipeline"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Sub Pipeline<UiLabel class="text-lg text-red-500"
              >*</UiLabel
            >
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="subPipelineField" v-bind="subPipelineFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select sub pipeline" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="(subPipelineData, index) in subPipelines"
                  :value="subPipelineData.reference_value"
                  >{{ subPipelineData.display_value }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">{{ errors?.subPipeline }}</span>
          <span class="text-xs text-gray-500">Select your sub pipeline.</span>
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-if="
          integrationsData.find(
            (integration) => integration.id === values.integrationId,
          )?.crm === 'zoho-bigin'
        "
        v-model="pipelineField"
        v-bind="pipelineFieldAttrs"
        name="pipelineId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Pipeline<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect
              v-model="pipelineField"
              v-bind="pipelineFieldAttrs"
              @update:model-value="handlePipelineChange"
            >
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Pipeline" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="(integrationData, index) in pipelines"
                  :value="integrationData.id"
                  >{{ integrationData.display_label }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">{{ errors?.pipelineId }}</span>
          <span class="text-xs text-gray-500">Select your pipeline.</span>
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-if="values.pipelineId && values.integrationId"
        v-model="stageField"
        v-bind="stageFieldAttrs"
        name="stageId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Stage<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-model="stageField" v-bind="stageFieldAttrs">
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Stage" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="(stageData, index) in stages"
                  :value="stageData.id"
                  >{{ stageData.display_value }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">{{ errors?.stageId }}</span>
          <span class="text-xs text-gray-500">Select your Pipeline Stage.</span>
        </UiFormItem>
      </UiFormField>

      <UiFormField
        v-if="
          integrationsData.find(
            (integration) => integration.id === values.integrationId,
          )?.crm === 'zoho-crm'
        "
        v-model="layoutField"
        v-bind="layoutFieldAttrs"
        name="layoutId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Layout<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect
              v-model="layoutField"
              v-bind="layoutFieldAttrs"
              @update:model-value="handleCrmChange"
            >
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select Layout" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="(integrationData, index) in layouts"
                  :value="integrationData.id"
                  >{{ integrationData.name }}</UiSelectItem
                >
              </UiSelectContent>
            </UiSelect>
          </UiFormControl>
          <span class="text-sm text-red-500">{{ errors?.layoutId }}</span>
          <span class="text-xs text-gray-500">Select your layout.</span>
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-if="
          integrationsData.find(
            (integration) => integration.id === values.integrationId,
          )?.crm === 'sell-do'
        "
        v-model="campaignField"
        v-bind="campaignFieldAttrs"
        name="campaignId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel class="font-bold">Campaign Id</UiFormLabel>
          <UiFormControl>
            <UiInput
              v-model="campaignField"
              v-bind="campaignFieldAttrs"
              type="text"
              placeholder="Enter your campaign id"
            />
          </UiFormControl>

          <span class="text-sm text-red-500">{{ errors?.campaignId }}</span>
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-if="
          integrationsData.find(
            (integration) => integration.id === values.integrationId,
          )?.crm === 'sell-do'
        "
        v-model="projectField"
        v-bind="projectFieldAttrs"
        name="projectId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel class="font-bold">Project Id</UiFormLabel>
          <UiFormControl>
            <UiInput
              placeholder="Enter your project id"
              v-model="projectField"
              v-bind="projectFieldAttrs"
              type="text"
            />
          </UiFormControl>

          <span class="text-sm text-red-500">{{ errors?.projectId }}</span>
        </UiFormItem>
      </UiFormField>

      <UiButton type="submit" class="mt-2" color="primary">
        Save changes
      </UiButton>
    </UiForm>
  </DialogWrapper>
</template>
<script setup lang="ts">
  import { useForm } from "vee-validate";
  import { createEditCRMConfigValidation } from "~/validationSchema/createEditCrmConfigvalidation";

  const emit = defineEmits(["success"]);
  let pipelines = ref<any>([]);
  let layouts = ref([]);
  const stages = ref<any>([]);
  const subPipelines = ref<any>([]);

  const modalState = defineModel<{ open: boolean }>({
    default: { open: false },
    required: true,
  });
  const modalProps = defineProps<{ id: any }>();
  const route: any = useRoute();
  const {
    setFieldValue,
    values,
    handleSubmit,
    errors,
    defineField,
    resetForm,
  } = useForm({
    validationSchema: toTypedSchema(createEditCRMConfigValidation),
    initialValues: {},
  });
  const [integrationField, integrationFieldAttrs] =
    defineField("integrationId");
  const [campaignField, campaignFieldAttrs] = defineField("campaignId");
  const [projectField, projectFieldAttrs] = defineField("projectId");
  const [pipelineField, pipelineFieldAttrs] = defineField("pipelineId");
  const [layoutField, layoutFieldAttrs] = defineField("layoutId");
  const [stageField, stageFieldAttrs] = defineField("stageId");
  const [subPipelineField, subPipelineFieldAttrs] = defineField("subPipeline");

  // subPipelineField

  watch(
    () => modalState.value,
    async (value) => {
      resetForm();
      if (value.open && modalProps.id) {
        try {
          const crmConfigData = await $fetch<any>(
            `/api/bots/${route.params.id}/integrations/${modalProps.id}`,
          );
          if (crmConfigData) {
            console.log({ crmConfigData });
            setFieldValue("integrationId", crmConfigData.integrationId);

            // Set other fields based on the CRM type
            const selectedCrm = integrationsData.value.find(
              (integration: any) =>
                integration.id === crmConfigData.integrationId,
            );
            console.log({ selectedCrm });

            if (selectedCrm?.crm === "zoho-bigin") {
              setFieldValue("pipelineId", crmConfigData?.metadata?.pipelineId);
              console.log("stageId", crmConfigData?.metadata?.pipelineObj?.id);
              setFieldValue(
                "stageId",
                crmConfigData?.metadata?.pipelineObj?.id,
              );
              setFieldValue(
                "subPipeline",
                crmConfigData?.metadata?.pipelineObj?.Sub_Pipeline,
              );
              await handleCrmChange(crmConfigData.integrationId);
              await handlePipelineChange(crmConfigData.pipelineId);
            } else if (selectedCrm?.crm === "zoho-crm") {
              setFieldValue("layoutId", crmConfigData?.metadata?.layoutId);
              await handleCrmChange(crmConfigData?.integrationId);
            } else if (selectedCrm?.crm === "sell-do") {
              setFieldValue("campaignId", crmConfigData?.metadata?.campaignId);
              setFieldValue("projectId", crmConfigData?.metadata?.projectId);
            }
          }
        } catch (error) {
          console.error("Error fetching CRM config data:", error);
        }
      }
    },
    { deep: true },
  );

  const handlePipelineChange = async (e: any) => {
    stages.value = pipelines.value
      .find((pipeline: any) => pipeline.id === e)
      .sections?.find((section: any) => section.sequence_number === 2)
      ?.fields?.find(
        (field: any) => field.field_label === "Stage",
      )?.pick_list_values;
  };
  const handleCrmChange = async (e: any) => {
    const matchedCRM: any = integrationsData?.value?.find(
      (integration: any) => {
        if (integration.id === e) {
          return integration;
        }
      },
    );
    console.log({ matchedCRM });
    if (matchedCRM.crm === "zoho-bigin") {
      const data: any = await $fetch(
        `/api/org/integrations/zoho-bigin/pipelines?id=${matchedCRM.id}`,
      );
      pipelines.value = data.layouts;

      const subPipelineData = await $fetch(
        `/api/org/integrations/zoho-bigin/sub-pipeline?id=${matchedCRM.id}`,
      );
      subPipelines.value = subPipelineData;
    } else if (matchedCRM.crm === "zoho-crm") {
      const data: any = await $fetch(
        `/api/org/integrations/zoho-crm/layouts?id=${matchedCRM.id}`,
      );
      layouts.value = data.layouts;
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

  const handleAddIntegration = handleSubmit((value: any) => {
    let pipelineObj: any = {};
    let layoutObj: any = {};

    if (value?.pipelineId) {
      let pipelineData = pipelines.value.find(
        (pipeline: any) => pipeline.id === value.pipelineId,
      );
      let stage = pipelineData.sections
        ?.find((section: any) => section.sequence_number === 2)
        ?.fields?.find((field: any) => field.field_label === "Stage")
        ?.pick_list_values?.find((list: any) => list.id === value.stageId);
      pipelineObj = {
        Stage: stage.reference_value,
        id: stage.id,
        Sub_Pipeline: value.subPipeline,
        Pipeline: {
          name: pipelineData.name,
          id: pipelineData.id,
        },
      };
    } else if (value?.layoutId) {
      const layoutData: any = layouts.value.find(
        (pipeline: any) => pipeline.id === value.layoutId,
      );

      layoutObj = { name: layoutData.name, id: layoutData.id };
    }
    if (modalProps.id) {
      updateBotIntegrationById({
        payload: {
          ...value,
          botId: route.params.id,
          botIntegrationId: modalProps.id,
          ...(pipelineObj && { pipelineObj }),
          ...(layoutObj && { layoutObj }),
        },
        onSuccess: () => {
          emit("success");
          toast.success("Integration updated successfully");
        },
      });
    } else {
      addBotIntegration({
        payload: {
          ...value,
          botId: route.params.id,
          ...(pipelineObj && { pipelineObj }),
          ...(layoutObj && { layoutObj }),
        },
        onSuccess: () => {
          emit("success");
          toast.success("Integration created successfully");
        },
      });
    }
  });
</script>
