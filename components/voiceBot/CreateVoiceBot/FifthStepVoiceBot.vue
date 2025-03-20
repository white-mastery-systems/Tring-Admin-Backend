<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useField } from 'vee-validate';
// import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, any>;
  disabled: Record<boolean, any>;
  intentOptions: Record<string, any>;
}>();

const emit = defineEmits(["update:values"]);
const { value: selectedGoal } = useField<string>('GOAL');
const { value: type } = useField("type");
const { value: temperature } = useField("temperature")
const { value: provider_stt } = useField("provider_stt")
const { value: provider_tts } = useField("provider_tts")
const { value: max_output_token } = useField("max_output_token")
const { value: otherRole, errorMessage: otherRoleError } = useField("otherRole");
const { value: otherGoal, errorMessage: otherGoalError } = useField("otherGoal");
// const { intentOptions, status, error, fetchConfig } = useChatbotConfig();

const providers = ref([
  {
    label: "Google",
    value: "google",
  },
  {
    label: "Azure",
    value: "azure",
  },
  {
    label: "Deepgram",
    value: "deepgram",
  },
  {
    label: "Assembly Ai",
    value: "assemblyai",
  },
]);
const providersTSS = [
  {
    label: "tring",
    value: "tring",
  },
  {
    label: "google",
    value: "google",
  },
  {
    label: "elevenlabs",
    value: "elevenlabs",
  },
  {
    label: "deepgram",
    value: "deepgram",
  },
];
const tokens = ["8192", "1024", "2048", "4096"];
const models = ref([
  {
    label: "Long",
    value: "long",
  },
  {
    label: "Short",
    value: "short",
  },
]);
// Watch for role selection changes
watch(selectedGoal, (newValue) => {
  if (newValue !== "custom") {
    // Clear otherRole and otherGoal when a non-custom option is selected
    otherRole.value = "";
    otherGoal.value = "";
  }
  emit("update:values", {
    ...props.values,
    ROLE: newValue,
    otherRole: otherRole.value,
    otherGoal: otherGoal.value
  });
});

// Watch for otherRole and otherGoal changes
watch([otherRole, otherGoal], ([newRole, newGoal]) => {
  if (selectedGoal.value === "custom") {
    emit("update:values", {
      ...props.values,
      otherRole: newRole,
      otherGoal: newGoal
    });
  }
});

// watch(() => props.values.type, (newType) => {
//   props.fetchConfig(newType);
// }, { deep: true, immediate: true });
</script>
<template>
  <UiCard class="border-0 ma-0">
    <UiCardHeader class="p-0">
      <div class="flex items-center justify-between gap-4 px-4 pt-4">
        <div class="flex flex-col gap-[6px]">
          <UiCardTitle class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">Bot Setup
          </UiCardTitle>
          <UiCardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">Set up your bot’s features, responses, and preferences</UiCardDescription>
        </div>
        <UiCardDescription class="text-[14px] font-medium">
          <span class="text-[#09090B]">Step 5</span><span class="text-[#64748B]">/6</span>
        </UiCardDescription>
      </div>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-3" />
    </UiCardHeader>

    <!-- <div class="mt-4">
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full h-[0.5px]" />
    </div> -->
    <UiCardContent class="grid gap-3 sm:gap-3 md:gap-4 p-4">
        <div>
            <span class="font-bold">Speech-To-Text (STT) Setup</span>
            <div class="grid grid-cols-2 gap-4">
              <SelectField v-model="provider_stt" name="provider_stt" :options="providers" label="Provider" placeholder="Select provider"
              helperText="Select your provider." required></SelectField>
              <SelectField v-if="provider_stt === 'deepgram'" name="model" :options="models" label="Model"
              placeholder="Select Model" helperText="Select your model.">
            </SelectField>
            </div>
        </div>
        <div>
          <span class="font-bold">Text-To-Speech (TTS) Setup</span>
          <div class="grid grid-cols-2 gap-4">
            <SelectField v-model="provider_tts" name="provider_tts" label="Provider" placeholder="Select provider"
              helperText="Select your provider." :options="providersTSS" required />
            <TextField v-if="provider_tts === 'google'" type="text" label="Name" name="name" required
            placeholder="Name" />
          </div>
        </div>
        <div>
        <span class="font-bold">Large Language Model (LLM) Setup</span>
        <div class="grid grid-cols-2 gap-4">
        <SelectField v-model="max_output_token" name="max_output_token" label="Max Tokens" placeholder="Max Tokens"
        :options="tokens.map((token) => ({ label: token, value: token }))" :required="true" />
        <div class="mt-5 flex flex-col gap-2">
          <RangeSlider :step="0.05" :name="temperature" label="Temperature" @update="($event) => { temperature = $event; }"  required placeholder="Enter speaking Rate" min="0" max="2" />
        </div>
          </div>
        </div>
    </UiCardContent>
  </UiCard>
</template>
