<script setup lang="ts">
  import { type Ref, ref } from "vue";
  import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
    today,
  } from "@internationalized/date";

  import { Calendar as CalendarIcon } from "lucide-vue-next";
  import type { DateRange } from "radix-vue";
  const df = new DateFormatter("en-US", {
    dateStyle: "medium",
  });

  const emit = defineEmits<{
    (event: "change", value: { from: string; to: string }): void;
  }>();

  const currentDate = ref(today(getLocalTimeZone()));
  const value = ref({
    start: currentDate.value,
    end: currentDate.value,
  }) as Ref<DateRange>;

  const debouncedValue = debouncedRef(value, 800);

  watch(debouncedValue, (newValue) => {
    if (newValue.start && newValue.end) {
      console.log({
        from: newValue.start.toDate(getLocalTimeZone()).toISOString(),
        to: newValue.end.toDate(getLocalTimeZone()).toISOString(),
      });
      emit("change", {
        from: newValue.start.toDate(getLocalTimeZone()).toISOString(),
        to: newValue.end
          .add({ days: 1 })
          .toDate(getLocalTimeZone())
          .toISOString(),
      });
    }
  });

  const isDateDisabled = (date: CalendarDate) => {
    return date > today(getLocalTimeZone());
  };
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger as-child>
      <UiButton variant="outline" :class="
          cn(
            'w-[120px] sm:w-[120px] md:w-[260px] lg:w-[240px] xl:w-[240px] justify-start text-left font-normal truncate',
            !value && 'text-muted-foreground',
          )
        ">
        <CalendarIcon class="mr-0 sm:mr-0 md:mr-2 lg:mr-2 xl:mr-2 h-4 w-4" />
        <template v-if="value.start">
          <template v-if="value.end">
            {{ df.format(value.start.toDate(getLocalTimeZone())) }} -
            {{ df.format(value.end.toDate(getLocalTimeZone())) }}
          </template>

          <template v-else>
            {{ df.format(value.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>
        <template v-else> Pick a date </template>
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-auto p-0">
      <div class="px-8 py-2">
        <DateRangePresetSelect @change="(newValue) => (value = newValue)" />
      </div>
      <UiRangeCalendar v-model="value" initial-focus :is-date-disabled="isDateDisabled" :number-of-months="2"
        @update:start-value="(startDate) => (value.start = startDate)" />
    </UiPopoverContent>
  </UiPopover>
</template>
