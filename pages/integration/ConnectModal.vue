<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <UiButton variant="outline"> Connect </UiButton>
    </UiDialogTrigger>
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader>
        <UiDialogTitle>Connect {{ props?.integrationName }}</UiDialogTitle>
      </UiDialogHeader>
      <UiForm :keep-values="true" :validate-on-mount="false" class="space-y-2">
        <UiFormField name="GOAL">
          <UiFormItem class="w-full">
            <UiFormLabel>API key <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput type="text" placeholder="Eg: api-key-here" />
            </UiFormControl>
            <span class="text-xs text-gray-500">Enter your API key here</span>
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
  const props = defineProps<{
    integrationName: string;
  }>();

  function copy(id: string) {
    navigator.clipboard.writeText(id);
  }
</script>
