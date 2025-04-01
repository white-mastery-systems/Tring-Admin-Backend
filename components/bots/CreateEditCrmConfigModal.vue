<template>
  <DialogWrapper v-model="modalState" :title="modalProps?.id ? `Edit CRM` : 'Link CRM'">
    <form @submit="handleAddIntegration">
      <div class="flex flex-col gap-3">
        <SelectField name="integrationId" :multiple="false" :required="true" label="Select Connected CRM"
          placeholder="Select Connected CRM" :options="
            integrationsData.map((integration) => ({
              value: integration.id,
              label: integration.name,
            }))
          " />
        <div v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'zoho-bigin'
          ">
          <SelectField name="pipelineId" :multiple="false" :required="true" label="Select Pipeline"
            placeholder="Select Pipeline" :options="
              pipelines.map((pipe) => ({
                value: pipe.id,
                label: pipe.display_label,
              }))
            " />
        </div>
        <div v-if="values.pipelineId && values.integrationId">
          <SelectField name="stageId" :multiple="false" :required="true" :label="'Select Stage'"
            placeholder="Select Stage" :options="
              stages.map((stage) => ({
                value: stage.id,
                label: stage.display_value,
              }))
            " />
        </div>
        <div v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'zoho-crm'
          ">
          <SelectField name="layoutId" :multiple="false" :required="true" label="Select Layout"
            placeholder="Select Layout" :options="
              layouts.map((layout) => ({
                value: layout.id,
                label: layout.name,
              }))
            " />
        </div>
        <div v-if="integrationsData.find((integration:any) => integration.id === values.integrationId)?.crm === 'sales-handy'">
          <SelectField name="sequenceId" :multiple="false" :required="true" label="Select Sequence"
            placeholder="Select Sequence" :options="
              sequences.map((sequence:any) => ({
                value: sequence.id,
                label: sequence.name,
              }))
            " />
        </div>

        <div class="flex flex-col gap-3" v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'sell-do'
          ">
          <TextField name="campaignId" label="Campaign Id" placeholder="Enter Your Campaign Id" />

          <TextField name="projectId" label="Project Id" placeholder="Enter Your Project Id" />
        </div>

        <div class="flex flex-col gap-3" v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'reserve-go'
          ">
          <TextField name="restaurantId" label="Restaurant Id" placeholder="Enter Your Restaurant Id" />
        </div>

        <div v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'hubspot'
          ">
          <SelectField name="stage" label="pipeLine" placeholder="Select Stage" :options="[
              { label: 'Appointment Scheduled', value: 'appointmentscheduled' },
              { label: 'Qualified to Buy', value: 'qualifiedtobuy' },
              {
                label: 'Presentation Scheduled',
                value: 'presentationscheduled',
              },
              {
                label: 'Decision Maker Bought-In',
                value: 'decisionmakerboughtin',
              },
              { label: 'Contract Sent', value: 'contractsent' },
              { label: 'Closed Won', value: 'closedwon' },
              { label: 'Closed Lost', value: 'closedlost' },
            ]" :required="true" />
        </div>
      </div>

      <UiButton color="primary" type="submit" class="mt-2" :loading="isLoading">
        Save changes
      </UiButton>
    </form>
  </DialogWrapper>
</template>
<script setup lang="ts">
  import { useForm } from "vee-validate";
  import { createEditCRMConfigValidation } from "~/validationSchema/createEditCrmConfigvalidation";

  const emit = defineEmits(["success"]);
  let pipelines = ref<any>([]);
  let sequences = ref<any>([]);
  let layouts = ref([]);
  const stages = ref<any>([]);
  const subPipelines = ref<any>([]);
  const isLoading = ref(false);

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
  // const [subPipelineField, subPipelineFieldAttrs] = defineField("subPipeline");

  // subPipelineField
watchEffect(async () => {
  if (values.pipelineId) {
    await handlePipelineChange(values.pipelineId)
    // You can add any logic here that depends on values.pipelineId
  }
});
  watch(
    () => values.pipelineId,
    async (newValue) => {
      await handlePipelineChange(newValue);
    },
  { deep: true });

  watch(
    () => values.integrationId,
    async (newValue, oldValue) => {
      await handleCrmChange(newValue);
    },
  );
  watch(
    () => values.layoutId,
    async (newValue, oldValue) => {
      await handleCrmChange(newValue);
    },
  );
  watch(
    () => values.sequenceId,
    async (newValue) => {
      await handleCrmChange(newValue);
    },
  );

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
            setFieldValue("integrationId", crmConfigData.integrationId);

            // Set other fields based on the CRM type
            const selectedCrm = integrationsData.value.find(
              (integration: any) =>
                integration.id === crmConfigData.integrationId,
            );

            if (selectedCrm?.crm === "zoho-bigin") {
              setFieldValue("pipelineId", crmConfigData?.metadata?.pipelineId);
              setFieldValue(
                "stageId",
                crmConfigData?.metadata?.pipelineObj?.id,
              );

              // setFieldValue(
              //   "subPipeline",
              //   crmConfigData?.metadata?.pipelineObj?.Sub_Pipeline,
              // );
              await handleCrmChange(crmConfigData.integrationId);
              await handlePipelineChange(crmConfigData.pipelineId);
            } else if (selectedCrm?.crm === "zoho-crm") {
              setFieldValue("layoutId", crmConfigData?.metadata?.layoutObj.id);
              await handleCrmChange(crmConfigData?.integrationId);
            } else if (selectedCrm?.crm === "sell-do") {
              setFieldValue("campaignId", crmConfigData?.metadata?.campaignId);
              setFieldValue("projectId", crmConfigData?.metadata?.projectId);
            } else if (selectedCrm?.crm === "hubspot") {
              setFieldValue("stage", crmConfigData?.metadata?.stage);
            } else if (selectedCrm?.crm === "reserve-go") {
              setFieldValue("restaurantId", crmConfigData?.metadata?.restaurantId);
            } else if (selectedCrm?.crm === "sales-handy") {
              setFieldValue("sequenceId", crmConfigData?.metadata?.sequenceObj?.id);
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
        (field: any) => field.api_name === "Stage",
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
    if(!matchedCRM) return 
    if (matchedCRM.crm === "zoho-bigin") {
      const data: any = await $fetch(
        `/api/org/integrations/zoho-bigin/pipelines?id=${matchedCRM.id}`,
      );
      if (data) {
        pipelines.value = data.layouts;
      }
      // else {
      //   toast.error('Pipeline field is empty')
      // }

      const subPipelineData = await $fetch(
        `/api/org/integrations/zoho-bigin/sub-pipeline?id=${matchedCRM.id}`,
      );
      subPipelines.value = subPipelineData;
    } else if (matchedCRM.crm === "zoho-crm") {
      const data: any = await $fetch(
        `/api/org/integrations/zoho-crm/layouts?id=${matchedCRM.id}`,
      );
      layouts.value = data?.layouts;
    } else if(matchedCRM.crm === "sales-handy") {
      const data: any = await $fetch(`/api/org/integrations/sales-handy/sequences?id=${matchedCRM.id}`);
      sequences.value = data?.sequences;
    }
  };
  const {
    status: integrationLoadingStatus,
    data: integrationsData,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations", {
    server: false,
    query: {
      q: "crm",
    },
    default: () => [],
  });

  const handleAddIntegration = handleSubmit((value: any) => {
    isLoading.value = true;
    let pipelineObj: any = {};
    let layoutObj: any = {};
    let sequenceObj: any = {};

    if (value?.pipelineId) {
      let pipelineData = pipelines.value.find(
        (pipeline: any) => pipeline.id === value.pipelineId,
      );
      let stage = pipelineData.sections
        ?.find((section: any) => section.name === "Potential Information")
        ?.fields?.find((field: any) => field.field_label === "Stage")
        ?.pick_list_values?.find((list: any) => list.id === value.stageId)
      const subPipeline = pipelineData.sections
        ?.find((section: any) => section.name === "Potential Information")
        ?.fields?.find((field: any) => field.api_name === "Sub_Pipeline")
        ?.pick_list_values[0]?.reference_value;
      pipelineObj = {
        Stage: stage.reference_value,
        id: stage.id,
        Sub_Pipeline: subPipeline,
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
    } else if (value?.sequenceId) {
      sequenceObj = sequences.value.find((sequence: any) => sequence.id === value.sequenceId);
    }
    if (modalProps.id) {
      updateBotIntegrationById({
        payload: {
          ...value,
          botId: route.params.id,
          botIntegrationId: modalProps.id,
          ...(pipelineObj && { pipelineObj }),
          ...(layoutObj && { layoutObj }),
          ...(sequenceObj && { sequenceObj }),
        },
        onSuccess: () => {
          emit("success");
          toast.success("Integration updated successfully");
          isLoading.value = false;
        },
      });
    } else {
      addBotIntegration({
        payload: {
          ...value,
          botId: route.params.id,
          ...(pipelineObj && { pipelineObj }),
          ...(layoutObj && { layoutObj }),
          ...(sequenceObj && { sequenceObj }),
        },
        onSuccess: () => {
          emit("success");
          toast.success("Integration created successfully");
          isLoading.value = false;
        },
      });
    }
    isLoading.value = false;
  });
</script>
