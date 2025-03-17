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
const { value: otherRole, errorMessage: otherRoleError } = useField("otherRole");
const { value: otherGoal, errorMessage: otherGoalError } = useField("otherGoal");
// const { intentOptions, status, error, fetchConfig } = useChatbotConfig();

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
          <UiCardTitle class="font-bold text-[16px] text-[16px] md:text-[20px] text-[#09090B]">Define your Chatbot's Goal
            in your Company?
          </UiCardTitle>
          <UiCardDescription class="font-normal text-[12px] sm:text-[12px] md:text-[14px] text-[#71717A]">Import your
            Select what you would like your bot to help you with</UiCardDescription>
        </div>
        <UiCardDescription class="text-[14px] font-medium">
          <span class="text-[#09090B]">Step 4</span><span class="text-[#64748B]">/4</span>
        </UiCardDescription>
      </div>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-3" />
    </UiCardHeader>

    <!-- <div class="mt-4">
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full h-[0.5px]" />
    </div> -->
    <UiCardContent class="grid gap-3 sm:gap-3 md:gap-6 p-4">
      <UiRadioGroup v-model="selectedGoal" orientation="vertical"
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5" :disabled="props.disabled">
        <div v-for="option in props.intentOptions.goals" :key="option.value"
          class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer min-h-[50px]"
          @click="selectedGoal = option.value">
          <div class="flex gap-4">
            <UiRadioGroupItem :id="option.value" :value="option.value" class="h-4 w-4 sm:h-4 sm:w-4 md:h-6 md:w-6" />
            <div class="flex flex-col gap-1">
              <Label :for="option.value" class="font-medium text-[12px] sm:text-[12px] md:text-[14px]">{{ option.name
              }}</Label>
              <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px]">{{ option.description }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer min-h-[50px]"
          @click="selectedGoal = 'custom'">
          <div class="flex gap-4">
            <UiRadioGroupItem id="custom" value="custom" class="h-4 w-4 sm:h-4 sm:w-4 md:h-6 md:w-6" />
            <div class="flex flex-col gap-1">
              <Label for="custom" class="font-medium text-[12px] sm:text-[12px] md:text-[14px]">Custom</Label>
              <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px]">"e.g., 'Rental Management Assistant
                – Help users find and manage rental properties easily.'"</span>
            </div>
          </div>
        </div>
      </UiRadioGroup>

      <!-- Show input field only if "Custom" is selected -->
      <div class="flex items-center gap-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full"
        v-if="selectedGoal === 'custom'">
        <!-- <div v-if="selectedGoal === ' custom'" class="mt-4 flex items-center gap-4 p-4 rounded-lg">
            <input v-model="customInput" type="text" placeholder="Enter custom intent"
              class="border px-4 py-2 w-full rounded-lg text-[14px] sm:text-[14px] md:text-[16px] h-20" />
        </div> -->
        <div>
          <p class="text-left text-[12px] sm:text-[12px] md:text-[14px] py-1 text-[#000000]">Tell us your Chatbot’s Goal in the Company</p>
          <UiTextarea v-model="otherGoal" name="otherGoal" :disabled="props.disabled" class="h-[95px] text-[12px] sm:text-[12px] md:text-[14px]" :resizable="false"
            placeholder="e.g., 'Rental Management Assistant – Help users find and manage rental properties easily.'"
            label="Tell us about your company">
          </UiTextarea>
        </div>
      </div>
    </UiCardContent>
  </UiCard>
</template>
