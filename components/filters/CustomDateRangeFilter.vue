<script setup lang="ts">
import { type Ref, ref } from "vue";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today,
} from "@internationalized/date";

import { CalendarIcon } from "lucide-vue-next";
import type { DateRange } from "radix-vue";
import { useDateOptions } from "~/composables/filters/useDateOptions";

const selectDate = defineModel<{ selectedValue: any }>({
  default: {
    selectedValue: "last-30-days",
  },
});
const props = withDefaults(
  defineProps<{
    selectDateField: boolean;
  }>(),
  {
    selectDateField: true,
  },
);
const { dateOptions } = useDateOptions();

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});
const selectedDate: any = ref('')


const emit = defineEmits<{
  (event: "change", value: { from: string; to: string }): void;
}>();

const currentDate = ref();
const value = ref({
  start: currentDate.value,
  end: currentDate.value,
}) as Ref<DateRange>;

const debouncedValue = debouncedRef(value, 800);

watch(debouncedValue, (newValue) => {
  if (newValue.start && newValue.end && ((selectedDate.value === 'custom') || (selectDate.value === 'custom'))) {
  
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
watch(selectDate.value.selectedValue, (newValue) => {
  emit("change", newValue);
})

const isDateDisabled = (date: CalendarDate) => {
  return date > today(getLocalTimeZone());
};
</script>

<template>
  <UiSelect v-if="props.selectDateField" v-model="selectedDate">
    <UiSelectTrigger class="text-[12px] min-w-[130px] max-w-[130px]">
      <UiSelectValue placeholder="Select a Date" />
    </UiSelectTrigger>
    <UiSelectContent class="text-[12px]">
      <UiSelectItem v-for="(rangeDate, index) in dateOptions" :key="index" :value="rangeDate.value">
        {{ rangeDate.content }}
      </UiSelectItem>
      <UiSelectItem value="all-time">All time</UiSelectItem>
      <UiSelectItem value="custom">Custom</UiSelectItem>
    </UiSelectContent>
  </UiSelect>
  <UiPopover v-if="(selectedDate === 'custom') || (selectDate === 'custom')" class="text-[#3D3D3D]">
    <UiPopoverTrigger as-child>
      <UiButton variant="outline" :class="cn(
        'min-w-[130px] max-w-[130px] justify-start text-left font-normal truncate rounded-lg',
        'border-[#FFBC42] border-[1px] focus:ring-1 focus:ring-[#FFBC42] focus:ring-opacity-50',
        !value && 'text-muted-foreground',
      )">
        <CalendarIcon class="mr-0 sm:mr-0 md:mr-2 lg:mr-2 xl:mr-2 h-4 w-4 text-[#FFBC42]" />
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
      <UiRangeCalendar v-model="value" initial-focus :is-date-disabled="isDateDisabled" :number-of-months="2"
        @update:start-value="(startDate) => (value.start = startDate)" />
    </UiPopoverContent>
  </UiPopover>
</template>