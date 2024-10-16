<template>
  <DialogWrapper
    v-model="modalState"
    :title="modalProps?.id ? `Edit Channel` : 'Link Channel'"
  >
    <form @submit="handleAddIntegration">
      <div class="flex flex-col gap-3">
        <SelectField
          name="integrationId"
          :multiple="false"
          :required="true"
          label="Select Connected Channel"
          placeholder="Select Connected Channel"
          :options="
            integrationsData.map((integration) => ({
              value: integration.id,
              label: integration.name,
            }))
          "
        />
        <div
          v-if="
            integrationsData.find(
              (integration) => integration.id === values.integrationId,
            )?.crm === 'slack'
          "
        >
          <SelectField
            name="channelId"
            :multiple="false"
            :required="true"
            label="Select Channel"
            placeholder="Select Channel"
            :options="
              channels?.map((channel) => ({
                value: channel.id,
                label: channel.name,
              }))
            "
          />
        </div>
      </div>

      <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
        Save changes
      </UiButton>
    </form>
  </DialogWrapper>
</template>
<script setup lang="ts">
  import { useForm } from "vee-validate";
  import { createEditCRMConfigValidation } from "~/validationSchema/createEditCrmConfigvalidation";

  const emit = defineEmits(["success"]);
  let channels = ref<any>([]);
  let layouts = ref([]);
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
              setFieldValue("channelId", crmConfigData?.metadata?.channelId);

              setFieldValue(
                "stageId",
                crmConfigData?.metadata?.pipelineObj?.id,
              );
              // setFieldValue(
              //   "subPipeline",
              //   crmConfigData?.metadata?.pipelineObj?.Sub_Pipeline,
              // );
              await handleCrmChange(crmConfigData.integrationId);
              await handlePipelineChange(crmConfigData.channelId);
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

  const handleCrmChange = async (e: any) => {
    const matchedCRM: any = integrationsData?.value?.find(
      (integration: any) => {
        if (integration.id === e) {
          return integration;
        }
      },
    );

    if (matchedCRM.crm === "slack") {
      const data: any = await $fetch(
        `/api/org/integrations/slack/channels?id=${matchedCRM.id}`,
      );

      channels.value = data.channels;
      console.log({ data });
      //   const data: any = await $fetch(
      //     `/api/org/integrations/zoho-bigin/pipelines?id=${matchedCRM.id}`,
      //   );
      //   pipelines.value = data.layouts;

      //   const subPipelineData = await $fetch(
      //     `/api/org/integrations/zoho-bigin/sub-pipeline?id=${matchedCRM.id}`,
      //   );
      //   subPipelines.value = subPipelineData;
    }
  };
  watch(
    () => values.integrationId,
    (newValue, oldValue) => {
      handleCrmChange(newValue);
    },
  );
  const {
    status: integrationLoadingStatus,
    data: integrationsData,
    refresh: integrationRefresh,
  } = await useLazyFetch("/api/org/integrations", {
    server: false,
    query: {
      q: "communication",
    },
    default: () => [],
  });

  const handleAddIntegration = handleSubmit((value: any) => {
    if (modalProps.id) {
      updateBotIntegrationById({
        payload: {
          ...value,
          botId: route.params.id,
          botIntegrationId: modalProps.id,
          channelId: values.channelId,
        },
        /*************  ✨ Codeium Command ⭐  *************/
        /**
         * Called when the integration is updated successfully.
         * Emits a 'success' event, shows a success toast and sets isLoading to false.
         */
        /******  a754d21e-bca4-4208-a938-0b7bb8ae7a60  *******/
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
          channelId: values.channelId,
        },
        onSuccess: () => {
          emit("success");
          toast.success("Integration created successfully");
          isLoading.value = false;
        },
      });
    }
  });
</script>
