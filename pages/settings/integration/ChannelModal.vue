<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
  const emit = defineEmits(["success"]);

  const route = useRoute();
  const channelModalState = defineModel<{ open: boolean, id: any }>({
    default: {
      open: false,
      id: null,
    },
  });
  const formSchema = toTypedSchema(
    z.object({
      name: z.string().min(1, "Name is required."),
      channel: z.string().min(2, "Channel is required."),
      pid: z.string().min(2, "Pid is required"),
      token: z.string().min(2, "Token is required"),
    }),
  );

  const {
    errors,
    setErrors,
    handleSubmit,
    setFieldValue,
    defineField,
    values,
    resetForm,
  } = useForm({
    validationSchema: formSchema
  })

const [nameField, nameFieldProps] = defineField("name");
const [channelField, channelFieldProps] = defineField("channel");
const [pidField, pidFieldProps] = defineField("pid");
const [tokenField, tokenFieldProps] = defineField("token")

watch(() => channelModalState.value.open, async (newState) => {
  console.log('watch', channelModalState.value.id)
  if (channelModalState.value.id) {
    const channelSingleDetail: any = await $fetch(`/api/org/integrations/${channelModalState.value.id}`)
    console.log(channelSingleDetail, "channelSingleDetail")
    setFieldValue("name", channelSingleDetail.name);
    setFieldValue("channel", channelSingleDetail.crm);
    setFieldValue("pid", channelSingleDetail.metadata?.pid);
    setFieldValue("token", channelSingleDetail.metadata?.token);
  } else {
    resetForm()
  }
});


const handleConnect = handleSubmit(async (values: any) => {
  console.log(values, "values")
    const payload = {
      name: values.name,
      crm: values.channel,
      metadata: {
        pid: values.pid,
        token: values.token,
      },
    };
    try {
      if (channelModalState.value.id) {
        await $fetch(`/api/org/integrations/${channelModalState.value.id}`, { method: "PUT", body: payload });
        toast.success("Integration update successfully");
      } else {
        await $fetch("/api/org/integrations", { method: "POST", body: payload });
        toast.success("Integration added successfully");
      }
      emit("success");
    } catch (error: any) {
      toast.error(error?.data?.data[0].message);
    }
  });
</script>

<template>
  <UiDialog v-model:open="channelModalState.open">
    <UiDialogContent
      class="max-w-[330px] rounded-lg sm:max-w-[300px] md:max-w-[400px] lg:max-w-[400px] xl:max-w-[400px]">
      <UiDialogHeader>
        <UiDialogTitle>Add New Channel</UiDialogTitle>
      </UiDialogHeader>
      <UiForm v-slot="{ values }" @submit="handleConnect" :keep-values="true" :validate-on-mount="false"
        class="space-y-2">
        <UiFormField v-model="nameField" v-bind="nameFieldProps" name="name">
          <UiFormItem class="w-full">
            <UiFormLabel :class="errors?.name ? 'text-[#ef4444]' : ''">Name <UiLabel class="text-lg text-red-500">*
              </UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput type="text" v-model="nameField" v-bind="nameFieldProps" placeholder="Enter Your Channel Name" />
            </UiFormControl>
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.name }}</p>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-model="channelField" v-bind="channelFieldProps" name="channel">
          <UiFormItem class="w-full">
            <UiFormLabel :class="errors?.channel ? 'text-[#ef4444]' : ''">
              Channel<UiLabel class="text-lg text-red-500">*</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiSelect v-model="channelField" v-bind="channelFieldProps">
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select a channel" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value="whatsapp">WhatsApp</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </UiFormControl>
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.channel }}</p>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-model="pidField" v-bind="pidFieldProps" name="pid">
          <UiFormItem class="w-full">
            <UiFormLabel :class="errors?.pid ? 'text-[#ef4444]' : ''">pid <UiLabel class="text-lg text-red-500">*
              </UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput type="text" v-model="pidField" v-bind="pidFieldProps" placeholder="Enter" />
            </UiFormControl>
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.pid }}</p>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
        <UiFormField v-model="tokenField" v-bind="tokenFieldProps" name="token">
          <UiFormItem class="w-full">
            <UiFormLabel :class="errors?.token ? 'text-[#ef4444]' : ''">Token <UiLabel class="text-lg text-red-500">
                *</UiLabel>
            </UiFormLabel>
            <UiFormControl>
              <UiInput type="text" v-model="tokenField" v-bind="tokenFieldProps" placeholder="Enter Token" />
            </UiFormControl>
            <UiFormMessage />
            <p class="mt-0 text-[14px] font-medium text-[#ef4444]">{{ errors?.token }}</p>
          </UiFormItem>
        </UiFormField>
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </UiForm>
    </UiDialogContent>
  </UiDialog>
</template>
<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->
