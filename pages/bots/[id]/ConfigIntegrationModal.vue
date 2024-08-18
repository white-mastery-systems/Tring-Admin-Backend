<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <UiButton variant="outline" color="primary"> Link Integration </UiButton>
    </UiDialogTrigger>
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader>
        <UiDialogTitle>Link Integration</UiDialogTitle>
      </UiDialogHeader>
      <UiForm :keep-values="true" :validate-on-mount="false" class="space-y-2">
        <UiFormField name="integration">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Select Connected Integation<UiLabel class="text-lg text-red-500"
                >*</UiLabel
              >
            </UiFormLabel>
            <UiFormControl>
              <UiSelect>
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select Integration" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value="zoho-crm">Zoho CRM</UiSelectItem>
                  <UiSelectItem value="zoho-bigin">Zoho Bigin</UiSelectItem>
                  <UiSelectItem value="sell-do">Sell Do</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500">Select your integration.</span>
          </UiFormItem>
        </UiFormField>
        <UiFormField name="pipeline">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Select Pipleine<UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect>
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select Pipeline" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value="zoho-crm">Project-1</UiSelectItem>
                  <UiSelectItem value="zoho-bigin">Project-2</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
            <span class="text-xs text-gray-500">Select your pipeline.</span>
          </UiFormItem>
        </UiFormField>

        <UiButton type="submit" class="mt-2" color="primary">
          Save changes
        </UiButton>
      </UiForm>
    </UiDialogContent>
  </UiDialog>
</template>
<script>
  
</script>
