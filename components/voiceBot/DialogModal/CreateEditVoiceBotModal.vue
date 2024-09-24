<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const agentModalState = defineModel<{ open: boolean }>({
  default: {
    open: false,
  },
});

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
    toast.error(err.data.statusMessage);
  }
});
</script>
<template>
  <DialogWrapper v-model="agentModalState" title="Add a New Voice Bot">
    <form class="mb-4 space-y-6"
      @submit="addVoiceBot">
      <TextField name="newBotName" label="Voice Bot Name" placeholder="Enter Voice Bot Name" required>
      </TextField>
      <div class="flex w-full items-center justify-end">
        <UiButton type="submit" class="w-1/2 self-end bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90">
          Create
        </UiButton>
      </div>
    </form>
  </DialogWrapper>
</template>
