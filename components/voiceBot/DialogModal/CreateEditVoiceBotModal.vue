<template>
  <DialogWrapper v-model="agentModalState" :title="agentModalState.id ? 'Edit Voice Bot' : 'Add a New Voice Bot'">
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
<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const agentModalState = defineModel<{ open: boolean; id: any }>({
  default: {
    open: false,
    id: null,
  },
});
const isLoading = ref(false);
const emit = defineEmits<{
    (e: "confirm"): void;
    (e: "editConfirm"): void;
  }>();

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

watch(
  () => agentModalState.value.open,
  async () => {
    resetForm();
    if (agentModalState.value.id) {
      const getSingleDetails: any = await $fetch(
        `/api/voicebots/${agentModalState.value.id}`,
      );
      setFieldValue("newBotName", getSingleDetails.name);
    }
  },
);


const addVoiceBot = handleSubmit(async (value: any) => {
  isLoading.value = true
  try {
    if (agentModalState.value.id) {
      const bot = await $fetch(`/api/voicebots/${agentModalState.value.id}`, {
        method: "PUT",
        body: { name: value.newBotName },
      });
      toast.success("Updated successfully");
  } else {
      const bot = await $fetch("/api/voicebots", {
        method: "POST",
        body: { name: value.newBotName },
      });
      toast.success("Created successfully");
      return navigateTo({
        name: "voice-bot-id",
        params: { id: bot.id },
      });
    }
    emit("editConfirm");
  } catch (err: any) {
    isLoading.value = false
    toast.error(err.data.statusMessage);
  }
  isLoading.value = false
});
</script>