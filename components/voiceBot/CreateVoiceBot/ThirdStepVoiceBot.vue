<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useField } from 'vee-validate';
// import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, any>;
  intentOptions: Record<string, any>;
}>();

const emit = defineEmits(["update:values"]);
const { value: selectedRole } = useField<string>('role');
const { value: otherRole, errorMessage: otherRoleError } = useField("otherRole");
const { value: otherGoal, errorMessage: otherGoalError } = useField("otherGoal");

// Watch for role selection changes
watch(selectedRole, (newValue) => {
  if (newValue !== "custom") {
    // Clear otherRole and otherGoal when a non-custom option is selected
    otherRole.value = "";
    otherGoal.value = "";
  }
  emit("update:values", {
    ...props.values,
    role: newValue,
    otherRole: otherRole.value,
    otherGoal: otherGoal.value
  });
});

// Watch for otherRole and otherGoal changes
watch([otherRole, otherGoal], ([newRole, newGoal]) => {
  if (selectedRole.value === "custom") {
    emit("update:values", {
      ...props.values,
      otherRole: newRole,
      otherGoal: newGoal
    });
  }
});
</script>

<template>
  <BotSetupCard title="Define your Voicebot's Role in your Company?"
    description="Select what your voicebot’s designation is going to be" currentStep="3" totalSteps="6">
    <UiRadioGroup v-model="selectedRole" orientation="vertical"
      class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
      <div v-for="option in props.intentOptions.roles" :key="option.value"
        class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer min-h-[50px]"
        @click="selectedRole = option.value">
        <div class="flex gap-4">
          <!-- Custom radio circle matching the design -->
          <div class="relative flex items-center justify-center h-5 w-5 flex-shrink-0">
            <div class="h-full w-full rounded-full border border-gray-400"
              :class="{ 'border-black': selectedRole === option.value }"></div>
            <div v-if="selectedRole === option.value" class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-black">
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <Label :for="option.value" class="font-medium text-[12px] sm:text-[12px] md:text-[14px]">{{ option.name
              }}</Label>
            <span class="text-[#71717A] text-[10px] sm:text-[10px] md:text-[12px]">{{ option.description }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4 border p-4 rounded-lg cursor-pointer min-h-[100px]"
        @click="selectedRole = 'custom'">
        <div class="flex gap-4">
          <!-- Custom radio for the "custom" option -->
          <div class="relative flex items-center justify-center h-5 w-5 flex-shrink-0">
            <div class="h-full w-full rounded-full border border-gray-400"
              :class="{ 'border-black': selectedRole === 'custom' }"></div>
            <div v-if="selectedRole === 'custom'" class="absolute inset-0 m-auto h-3 w-3 rounded-full bg-black"></div>
          </div>
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
      v-if="selectedRole === 'custom'">
      <div class="py-0 sm:py-0 md:py-6 px-0 min-h-[50px]">
        <p class="text-left text-[12px] sm:text-[12px] md:text-[14px] py-1 text-[#000000] font-medium">Tell us your
          Chatbot’s Role in the Company</p>
        <UiTextarea v-model="otherRole" name="otherRole" class="h-[95px] text-[12px] sm:text-[12px] md:text-[14px]"
          :resizable="false" placeholder="e.g., 'Sales Assistant" label="Tell us about your company">
        </UiTextarea>
      </div>
    </div>
  </BotSetupCard>
</template>
