<template>
  <DialogWrapper
    v-model="modalState"
    :title="modalProps?.id ? `Edit CRM` : 'Link CRM'"
  >
    <UiForm
      v-slot="{ values, errors }"
      :validation-schema="CRMConfigSchema"
      @submit="handleAddIntegration"
      class="space-y-2"
    >
      {{ console.log({ values, errors }) }}
      <UiFormField v-slot="{ componentField }" name="newBotName">
        <UiFormItem class="w-full">
          <UiFormLabel class="font-bold">Chat Bot Name</UiFormLabel>
          <UiFormControl>
            <UiInput
              v-bind="componentField"
              class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium"
              placeholder="Enter Chat Bot Name"
              type="text"
            />
            <UiFormDescription lass="text-xs text-gray-500"
              >Enter your unique identifier for Chat Bot.
            </UiFormDescription>
            <UiFormMessage />
          </UiFormControl>
        </UiFormItem>
      </UiFormField>

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
          <UiFormMessage />
          <span class="text-xs text-gray-500">Select your pipeline.</span>
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-if="values.pipelineId && values.integrationId"
        v-slot="{ componentField }"
        name="stageId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Stage<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect v-bind="componentField">
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
          <UiFormMessage />
          <span class="text-xs text-gray-500">Select your Pipeline Stage.</span>
        </UiFormItem>
      </UiFormField>
      <UiFormField
        v-if="
          integrationsData.find(
            (integration) => integration.id === values.integrationId,
          )?.crm === 'zoho-crm'
        "
        v-slot="{ componentField }"
        name="layoutId"
      >
        <UiFormItem class="w-full">
          <UiFormLabel
            >Select Layout<UiLabel class="text-lg text-red-500">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiSelect
              v-bind="componentField"
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
          <UiFormMessage />
          <span class="text-xs text-gray-500">Select your layout.</span>
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
  </DialogWrapper>
</template>
<script setup lang="ts">
  import { useForm } from "vee-validate";

  const { handleSubmit } = useForm();

  // const onSubmit = handleSubmit((values) => {
  //   // pretty print the values object
  //   console.log({ values });
  //   actions.setValues({ email: "value", password: "hi" });
  // });

  const emit = defineEmits(["success"]);
  let pipelines = ref<any>([]);
  let layouts = ref([]);
  const stages = ref<any>([]);

  const modalState = defineModel<{ open: boolean }>({
    default: { open: false },
    required: true,
  });
  const modalProps = defineProps<{ id: any }>();
  const route = useRoute("bots-id-crm-config");
  const { setFieldValue } = useForm();
  watch(
    () => modalState.value.open,
    async (isOpen) => {
      if (isOpen && modalProps.id) {
        console.log("Modal opened with ID:", modalProps.id);
        try {
          const crmConfigData = await $fetch<any>(
            `/api/bots/${route.params.id}/integrations/${modalProps.id}`,
          );
          console.log("Fetched CRM config data:", crmConfigData);
          setFieldValue("newBotName", "John");

          // Assuming crmConfigData.data contains the relevant information
          if (crmConfigData) {
            console.log({ crmConfigData });
            setFieldValue("integrationId", crmConfigData.id);

            // Set other fields based on the CRM type
            const selectedCrm = integrationsData.value.find(
              (integration: any) =>
                integration.id === crmConfigData.integrationId,
            );

            if (selectedCrm?.crm === "zoho-bigin") {
              setFieldValue("pipelineId", crmConfigData.pipelineId);
              setFieldValue("stageId", crmConfigData.stageId);
              await handleCrmChange(crmConfigData.integrationId);
              await handlePipelineChange(crmConfigData.pipelineId);
            } else if (selectedCrm?.crm === "zoho-crm") {
              setFieldValue("layoutId", crmConfigData.layoutId);
              await handleCrmChange(crmConfigData.integrationId);
            } else if (selectedCrm?.crm === "sell-do") {
              setFieldValue("campaignId", crmConfigData.campaignId);
              setFieldValue("projectId", crmConfigData.projectId);
            }
          }
        } catch (error) {
          console.error("Error fetching CRM config data:", error);
        }
      }
    },
  );

  const handlePipelineChange = async (e: any) => {
    console.log({ e, piipe: pipelines.value });
    // stages.value pipelines.value.map((pipeline: any) => {
    //     return pipeline.id === e;
    //   });
    stages.value = pipelines.value
      .find((pipeline: any) => pipeline.id === e)
      .sections?.find(
        (section: any) => section.api_name === "Pipeline Information",
      )
      ?.fields?.find(
        (field: any) => field.field_label === "Stage",
      )?.pick_list_values;
    console.log(
      pipelines.value
        .find((pipeline: any) => pipeline.id === e)
        .sections?.find(
          (section: any) => section.api_name === "Pipeline Information",
        )
        ?.fields?.find((field: any) => field.field_label === "Stage"),
      "LISG LA",
    );
  };
  const handleCrmChange = async (e: any) => {
    const matchedCRM: any = integrationsData?.value?.find(
      (integration: any) => {
        if (integration.id === e) {
          console.log({ integration });
          return integration;
        }
      },
    );
    if (matchedCRM.crm === "zoho-bigin") {
      const data: any = await $fetch(
        `/api/org/integrations/zoho-bigin/pipelines?id=${matchedCRM.id}`,
      );
      pipelines.value = data.layouts;
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

  const handleAddIntegration = (value: any) => {
    let pipelineObj: any = {};
    let layoutObj: any = {};
    console.log({ value });
    if (value?.pipelineId) {
      let pipelineData = pipelines.value.find(
        (pipeline: any) => pipeline.id === value.pipelineId,
      );
      let stage = pipelineData.sections
        ?.find((section: any) => section.api_name === "Pipeline Information")
        ?.fields?.find((field: any) => field.field_label === "Stage")
        ?.pick_list_values?.find((list: any) => list.id === value.stageId);
      console.log({ stage });
      pipelineObj = {
        Stage: stage.reference_value,
        id: stage.id,
        Pipeline: {
          name: pipelineData.name,
          id: pipelineData.id,
        },
      };
    } else if (value?.layoutId) {
      const layoutData: any = layouts.value.find(
        (pipeline: any) => pipeline.id === value.layoutId,
      );
      console.log({ layoutData });
      layoutObj = { name: layoutData.name, id: layoutData.id };
    }

    addBotIntegration({
      payload: {
        ...value,
        botId: route.params.id,
        ...(pipelineObj && { pipelineObj }),
        ...(layoutObj && { layoutObj }),
      },
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
      layoutId: z.string().optional(),
      stageId: z.string().optional(),
    }),
  );
</script>
