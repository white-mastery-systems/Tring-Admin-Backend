<script setup lang="ts">
  import { format } from "date-fns";
  import { Link } from "lucide-vue-next";

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
        class="absolute left-[18px] top-[64px] block h-[105%] w-0.5 shrink-0 rounded-full opacity-100 group-data-[state=completed]:bg-[#424BD1]" />
      <UiStepperTrigger as-child class="rounded-full">
        <div>
          <Circle class="absolute left-[9px] top-[45px] size-5 rounded-full bg-[#424BD1]" />
        </div>
      </UiStepperTrigger>
      <div class="field_shadow flex w-full flex-col gap-1 rounded-lg p-4">
        <div class="flex flex-col gap-2">
          <h4 class="scroll-m-20 text-[16px] font-semibold tracking-tight">
            {{ data.metadata?.text }}
          </h4>
          <div class="flex items-center gap-5" v-if="data.metadata?.website">
            <span v-if="data.metadata?.title" class="min-w-[90px] text-[16px] font-semibold">
              {{ data.metadata?.title }}
            </span>
            <div class="flex items-center gap-2">
              <span>
                <LinkIcon />
              </span>
              <NuxtLink class="text-indigo-600" :to="data.metadata?.website" target="_blank">
                {{ data.metadata?.website }}
              </NuxtLink>
            </div>
          </div>
          <p class="mt-2 text-[14px] font-normal text-gray-600">
            {{ format(new Date(data.createdAt), "dd MMM yyyy hh:mm aa") }}
          </p>
        </div>
        <UiStepperDescription
          class="sr-only flex flex-col items-start gap-2 text-xs text-muted-foreground transition md:not-sr-only lg:text-sm">
        </UiStepperDescription>
      </div>
    </UiStepperItem>
  </UiStepper>
</template>
