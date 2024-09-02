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
const dateFilters = reactive([
  {
    content: "Today",
    value: "today",
  },
  {
    content: "This Week",
    value: "this-week",
  },
  {
    content: "This Month",
    value: "this-month",
  },
  {
    content: "Last 6 months",
    value: "6-months",
  },
  {
    content: "This Year",
    value: "this-year",
  },
]);
const selectedDate: any = ref('all')


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
  if (newValue.start && newValue.end && (selectedDate.value === 'custom')) {
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

watch(selectedDate, (newValue) => {
  emit("change", newValue);
})

const isDateDisabled = (date: CalendarDate) => {
  return date > today(getLocalTimeZone());
};
</script>

<template>
  <UiSelect v-model="selectedDate">
    <UiSelectTrigger class="w-[110px] sm:w-[110px] md:w-[250px] lg:w-[250px] xl:w-[250px]">
      <UiSelectValue placeholder="Select a Date" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem value="all">All</UiSelectItem>
      <UiSelectItem v-for="(rangeDate, index) in dateFilters" :key="index" :value="rangeDate.value">
        {{ rangeDate.content }}
      </UiSelectItem>
      <UiSelectItem value="custom">Custom</UiSelectItem>
    </UiSelectContent>
  </UiSelect>
  <UiPopover v-if="selectedDate === 'custom'">
    <UiPopoverTrigger as-child>
      <UiButton variant="outline" :class="cn(
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
      <!-- <div class="px-8 py-2">
        <DateRangePresetSelect @change="(newValue) => (value = newValue)" />
      </div> -->
      <UiRangeCalendar v-model="value" initial-focus :is-date-disabled="isDateDisabled" :number-of-months="2"
        @update:start-value="(startDate) => (value.start = startDate)" />
    </UiPopoverContent>
  </UiPopover>
</template>