<template>
  <UiCard class="border-0 ma-0 shadow-none">
    <UiCardHeader class="p-0">
      <div class="flex items-center justify-between gap-4 px-4 pt-4">
        <div class="flex flex-col gap-[6px]">
          <UiCardTitle class="font-bold text-[14px] sm:text-[14px] md:text-[20px] text-[#09090B]">
            {{ title }}
          </UiCardTitle>
          <UiCardDescription class="font-normal text-[10px] sm:text-[10px] md:text-[14px] text-[#71717A]">
            {{ description }}
          </UiCardDescription>
        </div>
        <UiCardDescription class="text-[12px] sm:text-[12px] md:text-[14px] font-medium" v-if="showSteps">
          <span class="text-[#09090B]">Step {{ currentStep }}</span><span class="text-[#64748B]">/{{ totalSteps
            }}</span>
        </UiCardDescription>
      </div>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] mt-3" />
    </UiCardHeader>
    <UiCardContent class="grid gap-3 p-4">
      <slot></slot>
    </UiCardContent>
  </UiCard>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  currentStep: {
    type: [Number, String],
    default: 1
  },
  totalSteps: {
    type: [Number, String],
    default: 1
  },
  showSteps: {
    type: Boolean,
    default: true
  }
});
</script>