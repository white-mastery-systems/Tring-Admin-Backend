<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const agentModalState = defineModel<{ open: boolean }>({
  default: {
    open: false,
  },
});
const isLoading = ref(false)

const createEditVoiceBotValidation = toTypedSchema(
  z.object({
    newBotName: z.string({required_error:"Bot Name is requird."}).min(2, "Bot Name is requird."),
  }),
);
const {
  errors,
  setErrors,
  setFieldValue,
  handleSubmit,
  defineField,
  values,
  resetForm,
} = useForm({
  validationSchema: createEditVoiceBotValidation,
});

watch(agentModalState, (newState) => { });


const addVoiceBot = handleSubmit(async (value: any) => {
  isLoading.value = true
  try {
    const bot = await $fetch("/api/voicebots", {
      method: "POST",
      body: { name: value.newBotName },
    });
    return navigateTo({
      name: "bot-management-voice-bot-id",
      params: { id: bot.id },
    });
  } catch (err: any) {
    isLoading.value = false
    toast.error(err.data.statusMessage);
  }
  isLoading.value = false
});
</script>
<template>
  <DialogWrapper v-model="agentModalState" title="Add a New Voice Bot">
    <form class="mb-4 space-y-6" @submit="addVoiceBot">
      <TextField name="newBotName" label="Voice Bot Name" placeholder="Enter Voice Bot Name" required>
      </TextField>
      <div class="flex w-full items-center justify-end">
        <UiButton type="submit" class="mt-2" color="primary" :loading="isLoading">
          Create
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
