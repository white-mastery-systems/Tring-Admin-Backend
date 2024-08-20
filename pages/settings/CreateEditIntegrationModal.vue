<script setup lang="ts">
  const emit = defineEmits(["success"]);
  const integrationModalState = defineModel<{ open: boolean }>({
    default: {
      open: false,
    },
  });
  watch(integrationModalState, (newIntegrationState) => {
    console.log({ newIntegrationState });
  });
  async function handleConnect(values: any) {
    const payload: any = {
      ...values,
    };
    await createIntegration({
      integrationDetails: payload,
      onSuccess: () => {
        emit("success");
      },
    });
  }

  const integrationSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      crm: z.string().min(1, { message: "CRM is required" }),
      metaData: z.object({
        apiKey: z.string().min(1, { message: "API key is required" }),
      }),
    }),
  );
</script>

<template>
  <UiDialog v-model:open="integrationModalState.open">
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader>
        <UiDialogTitle>Add New Integration</UiDialogTitle>
      </UiDialogHeader>
      <UiForm
        v-slot="{ values }"
        :validation-schema="integrationSchema"
        @submit="handleConnect"
        :keep-values="true"
        :validate-on-mount="false"
        class="space-y-2"
      >
        <UiFormField v-slot="{ componentField }" name="name">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Name <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                type="text"
                v-bind="componentField"
                placeholder="Eg: CRM-your company,CRM-your company"
              />
            </UiFormControl>
            <span class="text-xs text-gray-500"
              >Enter a unique identification for CRM integration</span
            >
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="crm">
          <UiFormItem class="w-full">
            <UiFormLabel>
              CRM<UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select CRM" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value="sell-do">Sell Do</UiSelectItem>
                  <UiSelectItem value="zoho-crm">Zoho CRM</UiSelectItem>
                  <UiSelectItem value="zoho-bigin">Zoho Bigin</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500">Select your CRM provider.</span>
          </UiFormItem>
        </UiFormField>

        <UiFormField
          v-if="values.crm === 'sell-do'"
          v-slot="{ componentField }"
          name="metaData.apiKey"
        >
          <UiFormItem class="w-full">
            <UiFormLabel
              >API key <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                type="text"
                v-bind="componentField"
                placeholder="Eg: api-key-here"
              />
            </UiFormControl>
            <span class="text-xs text-gray-500">Enter your API key here</span>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiButton type="submit" class="mt-2" color="primary">
          {{
            values.crm === "zoho-crm"
              ? "Connect Zoho CRM"
              : values.crm === "zoho-bigin"
                ? "Connect Zoho Bigin"
                : "Save changes"
          }}
        </UiButton>
      </UiForm>
    </UiDialogContent>
  </UiDialog>
</template>
