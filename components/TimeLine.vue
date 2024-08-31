<script setup lang="ts">
// Props: a single step object and the current index
defineProps({
  data: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <UiStepper orientation="vertical" class="mx-auto flex w-full flex-col justify-start gap-10">
    <UiStepperItem class="relative flex w-full items-start gap-6" v-slot="{ state }" :step="index + 1">
      <UiStepperSeparator v-if="index !== totalSteps - 1"
        class="absolute left-[18px] top-[50px] block h-[105%] w-0.5 shrink-0 rounded-full border-red-600 opacity-100 group-data-[state=completed]:bg-red-600" />
      <UiStepperTrigger as-child class="rounded-full">
        <div>
          <Circle class="absolute left-[9px] top-[30px] size-5 rounded-full bg-[#424BD1]" />
        </div>
      </UiStepperTrigger>
      <div class=" flex flex-col gap-1 field_shadow w-full p-4 rounded-lg">
        <UiStepperTitle :class="[state === 'active' && 'text-primary']"
          class="text-sm font-semibold transition lg:text-base">
          {{ data.metadata?.text }}
        </UiStepperTitle>
        <UiStepperDescription :class="[state === 'active' && 'text-primary']"
          class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
          {{ data.metadata?.type }}
        </UiStepperDescription>
      </div>
    </UiStepperItem>
  </UiStepper>
</template>
