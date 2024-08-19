<script setup lang="ts">
  const emit = defineEmits(["onSuccess"]);
  const props = defineProps<{
    label: string;
    name: string;
  }>();

  async function handleConnect(values: any) {
    console.log({ values });
    const payload: any = {
      name: props?.name,
      ...values,
      //   metadata: {
      //     // apiKey: values.metaData.apiKey,
      //     // secretKey: values.metaData.secretKey,
      //     // webhookUrl: values.metaData.webhookUrl,
      //   },
    };
    await createIntegration({
      integrationDetails: payload,
      onSuccess: () => {
        toast.success("Integration added successfully");
        emit("onSuccess");
      },
    });
    // await updateBotDetails(payload);
    // return navigateTo({
    //   name: "bots-id",
    //   params: { id: botDetails.id },
    // });
  }
</script>

<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <UiButton variant="outline"> Connect </UiButton>
    </UiDialogTrigger>
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader>
        <UiDialogTitle>Connect {{ props?.label }}</UiDialogTitle>
      </UiDialogHeader>
      <UiForm
        @submit="handleConnect"
        :keep-values="true"
        :validate-on-mount="false"
        class="space-y-2"
      >
        <UiFormField v-slot="{ componentField }" name="metaData.apiKey">
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
          Save changes
        </UiButton>
      </UiForm>
    </UiDialogContent>
  </UiDialog>
</template>
