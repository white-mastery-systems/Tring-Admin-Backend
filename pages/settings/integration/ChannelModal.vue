<script setup lang="ts">
const emit = defineEmits(["success"]);
  const channelModalState = defineModel<{ open: boolean }>({
    default: {
      open: false,
    },
  });
  watch(channelModalState, (newState) => {});

  const formSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, "Name is required."),
      channel: z.string().min(2, "Channel is required."),
      pid: z.string().min(2, "Pid is required"),
      token: z.string().min(2, "Token is required"),
    }),
  );

const handleConnect = async (values: any) => {
  const payload = {
    name: values.name,
    crm: values.channel,
    metaData: {
      pid: values.pid,
      token: values.token,
    },
  };
  try {
    await $fetch("/api/org/integrations", { method: "POST", body: payload });
    emit("success");
  } catch (error: any) {
    toast.error(error?.data?.data[0].message);
  }

};
</script>

<template>
  <UiDialog v-model:open="channelModalState.open">
    <UiDialogContent
      v-if="true"
      class="max-w-[330px] rounded-lg sm:max-w-[300px] md:max-w-[400px] lg:max-w-[400px] xl:max-w-[400px]"
    >
      <UiDialogHeader>
        <UiDialogTitle>Add New Channel</UiDialogTitle>
      </UiDialogHeader>
      <UiForm
        v-if="true"
        v-slot="{ values }"
        :validation-schema="formSchema"
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
                placeholder="Enter Your Channel Name"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="channel">
          <UiFormItem class="w-full">
            <UiFormLabel>
              Channel<UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-bind="componentField">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select a channel" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value="whatsapp">WhatsApp</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-slot="{ componentField }" name="pid">
          <UiFormItem class="w-full">
            <UiFormLabel
              >pid <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                type="text"
                v-bind="componentField"
                placeholder="Enter"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-slot="{ componentField }" name="token">
          <UiFormItem class="w-full">
            <UiFormLabel
              >Token <UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput
                type="text"
                v-bind="componentField"
                placeholder="Enter Token"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </UiForm>
    </UiDialogContent>
  </UiDialog>
</template>
<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->
