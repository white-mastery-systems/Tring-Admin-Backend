<template>
  <DialogWrapper v-model="props.ttsModalState"
    :title="(ttsModalState?.id) ? 'Edit TTS Integration' : 'Add New TTS Integration'">
    <Form @submit="handleConnect" class="space-y-3">
      <SelectField name="provider" placeholder="Select a provider" :options="providerList">
      </SelectField>
      <div class='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 xl:grid-cols-2'>
        <TextField v-if="(values.provider === 'elevenlabs')" type="text" label="Integration Name"
          name="ttsIntegrationName" required placeholder="Enter integration name" />
        <TextField v-if="(values.provider === 'elevenlabs')" type="text" label="API Key" name="apikey" required
          placeholder="API Key" @input="apikeyunmasking($event)" />
      </div>
      <div class="flex justify-end w-full">
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Submit
        </UiButton>
      </div>
    </Form>
  </DialogWrapper>
</template>
<script setup lang="ts">
import { ttsIntegrationSchema } from '~/validationSchema/ttsIntegrationValidation';
const props = defineProps<{
  ttsModalState: {
    open: boolean,
    id: number | null
  }
}>();
const emit = defineEmits(["success"]);
const isLoading = ref(false)
const providerList = ref([
  {
    label: "elevenlabs",
    value: "elevenlabs",
  },
])

const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: ttsIntegrationSchema,
});

watch(() => props.ttsModalState.open, async () => {
  resetForm()
  if (props.ttsModalState.id) {
    const getSingleDetails: any = await $fetch(`/api/tts-integration/${props.ttsModalState.id}`)
    console.log(getSingleDetails, "getSingleDetails -- getSingleDetails")
    console.log(getSingleDetails.metadata.apiKey, "getSingleDetails metadata -- getSingleDetails")
    setFieldValue("provider", getSingleDetails.provider);
    setFieldValue("apikey", getSingleDetails.metadata?.apiKey || getSingleDetails.metadata?.apikey);
    setFieldValue("ttsIntegrationName", getSingleDetails.ttsIntegrationName);
  }
})

const apikeyunmasking = ($event: Event) => {
  const input = $event.target as HTMLInputElement;
  const newInput = input.value.replace(/\*/g, '');
}

const handleConnect = handleSubmit(async (values: any) => {
  isLoading.value = true
  const payload = {
    metadata: {
      apiKey: values.apikey
    },
    provider: values.provider,
    ttsIntegrationName: values.ttsIntegrationName
  }
  try {
    if (props.ttsModalState.id) {
      await $fetch(`/api/tts-integration/${props.ttsModalState.id}`, { method: "PUT", body: payload });
      toast.success("Integration updated successfully");
    } else {
      await $fetch("/api/tts-integration",
        { method: "POST", body: payload });
      toast.success("Integration added successfully");
    }
    emit('success')
  } catch (error: any) {
    isLoading.value = false
    toast.error(error.data.statusMessage)
  }
  isLoading.value = false
});
</script>