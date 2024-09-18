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
      name: z.string({ required_error: "Name is required." }).min(1, "Name is required."),
      channel: z.string({ required_error: "Channel is required." }).min(2, "Channel is required."),
      pid: z.string({ required_error: "Pid is required"}).min(2, "Pid is required"),
      token: z.string({ required_error: "Token is required"  }).min(2, "Token is required"),
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

watch(() => channelModalState.value.open, async (newState) => {
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
  <DialogWrapper v-model="channelModalState" :title="(channelModalState.id) ? 'Modify Channel' : 'Add New Channel'">
    <form @submit="handleConnect" class="space-y-2">
      <TextField name="name" label="Name" placeholder="Enter Your Channel Name" helperText="" required>
      </TextField>
      <SelectField name="channel" label="Channel" placeholder="Select a channel" helperText="" :options="[
  { value: 'whatsapp', label: 'WhatsApp', },
      ]" required />
      <TextField name="pid" label="pid" placeholder="Enter" helperText="" required>
      </TextField>
      <TextField name="token" label="Token" placeholder="Enter Token" helperText="" required>
      </TextField>
      <div class="flex items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary"> Submit </UiButton>
      </div>
    </form>
  </DialogWrapper>
  <!-- <UiDialog v-model:open="channelModalState.open">
      <UiDialogContent
        class="max-w-[330px] rounded-lg sm:max-w-[300px] md:max-w-[400px] lg:max-w-[400px] xl:max-w-[400px]">
        <UiDialogHeader>
          <UiDialogTitle>Add New Channel</UiDialogTitle>
        </UiDialogHeader>
      </UiDialogContent>
    </UiDialog> -->
</template>
<!-- https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=1000.7ZU032OIFSMR5YX325O4W3BNSQXS1U&scope=ZohoBigin.settings.ALL,ZohoBigin.modules.ALL&redirect_uri=https://tring-admin.pripod.com/settings/integration/zoho-bigin&prompt=consent&access_type=offline -->