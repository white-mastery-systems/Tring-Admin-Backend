<script setup lang="ts">
definePageMeta({
  middleware: "admin-only",
});

const agentModalState = defineModel<{ open: boolean }>({
  default: {
    open: false,
  },
});

const formSchema = toTypedSchema(
  z.object({
    newBotName: z.string({required_error:"Bot Name is requird."}).min(2, "Bot Name is requird."),
  }),
);

watch(agentModalState, (newState) => { });


const addVoiceBot = async (value: any) => {
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
};
</script>
<template>
  <DialogWrapper v-model="agentModalState" title="Add a New Voice Bot">
    <UiForm :validation-schema="formSchema" :keep-values="true" :validate-on-mount="false" class="mb-4 space-y-6"
      @submit="addVoiceBot">
      <UiFormField v-slot="{ componentField }" name="newBotName">
        <UiFormItem class="w-full">
          <UiFormLabel class="font-bold">Voice Bot Name</UiFormLabel>
          <UiFormControl>
            <UiInput v-bind="componentField" class="h-[50px] rounded-lg bg-[#f6f6f6] font-medium"
              placeholder="Enter Voice Bot Name" type="text" />
            <UiFormDescription lass="text-xs text-gray-500">Enter your unique identifier for Voice Bot.
            </UiFormDescription>
            <UiFormMessage />
          </UiFormControl>
        </UiFormItem>
      </UiFormField>
      <div class="flex w-full items-center justify-end">
        <UiButton type="submit" class="w-1/2 self-end bg-[#424bd1] text-white hover:bg-[#424bd1] hover:brightness-90">
          Create
        </UiButton>
      </div>
    </UiForm>
  </DialogWrapper>
</template>
