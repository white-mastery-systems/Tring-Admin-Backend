<script setup lang="ts">
import { ref, watch } from "vue";
import { useDateOptions } from "~/composables/filters/useDateOptions";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today, parseDate,
} from "@internationalized/date";
import type { DateRange } from "radix-vue";
import { CalendarIcon } from "lucide-vue-next";

const props = defineProps({
  period: {
    type: String,
    default: "all-time",
  },
  from: {
    type: String,
    default: null,
  },
  to: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:period", "update:from", "update:to","change"]);

const { dateOptions } = useDateOptions();

const selectedPeriod = ref(props.period);

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});
const dateFormat = ref({
  start: props.from ? parseDate(new Date(props.from).toISOString().split('T')[0]) : null,
  end: props.to ? parseDate(new Date(props.to).toISOString().split('T')[0]) : null,
}) as Ref<DateRange>;

const debouncedValue = debouncedRef(dateFormat, 800);

watchEffect(() => {
  selectedPeriod.value = props.period;
});
// Watch for changes in the date range (custom period)
watch(debouncedValue, (newValue) => {
  if (newValue.start && newValue.end && selectedPeriod.value === "custom") {
    emit("update:from", newValue.start.toDate(getLocalTimeZone()).toISOString());
    emit("update:to", newValue.end.toDate(getLocalTimeZone()).toISOString());
  }
});

// Watch for changes in the selected period
watch(selectedPeriod, (newValue) => {
  emit("update:period", newValue);
  emit("change", newValue);

  if (newValue !== "custom") {
    // Reset 'from' and 'to' when a non-custom period is selected
    emit("update:from", null);
    emit("update:to", null);
    dateFormat.value.start = null;
    dateFormat.value.end = null;
  }
  console.log(newValue, "inside --- newValue");
},{deep: true});

const isDateDisabled = (date: CalendarDate) => {
  return date > today(getLocalTimeZone());
};
</script>

<template>
  <div class="flex items-center gap-2">
    <UiSelect v-model="selectedPeriod">
      <UiSelectTrigger class="min-w-[130px] max-w-[130px]">
        <UiSelectValue class="text-left" placeholder="Select a Date" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem v-for="(rangeDate, index) in dateOptions" :key="index" :value="rangeDate.value">
          {{ rangeDate.content }}
        </UiSelectItem>
        <UiSelectItem value="all-time">All time</UiSelectItem>
        <UiSelectItem value="custom">Custom</UiSelectItem>
      </UiSelectContent>
    </UiSelect>

    <UiPopover v-if="selectedPeriod === 'custom'">
      <UiPopoverTrigger as-child>
        <UiButton variant="outline" class="min-w-[220px] max-w-[220px] justify-start text-left font-normal truncate">
          <CalendarIcon class="mr-2 h-4 w-4" />
          <template v-if="dateFormat.start">
            <template v-if="dateFormat.end">
              {{ df.format(dateFormat.start.toDate(getLocalTimeZone())) }} -
              {{ df.format(dateFormat.end.toDate(getLocalTimeZone())) }}
            </template>
            <template v-else>
              {{ df.format(dateFormat.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else> Pick a date </template>
        </UiButton>
      </UiPopoverTrigger>
      <UiPopoverContent class="w-auto p-0">
        <UiRangeCalendar v-model="dateFormat" initial-focus :is-date-disabled="isDateDisabled" :number-of-months="2"
          @update:start-value="(startDate) => (dateFormat.start = startDate)" />
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>