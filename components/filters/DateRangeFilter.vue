<!-- <script setup lang="ts">
import { type Ref, ref } from "vue";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today,
} from "@internationalized/date";

import { Calendar as CalendarIcon } from "lucide-vue-next";
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
    <UiSelectTrigger class="w-[110px] sm:w-[110px] md:w-[188px] lg:w-[188px] xl:w-[188px]">
      <UiSelectValue placeholder="Select a Date" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem v-for="(rangeDate, index) in dateOptions" :key="index" :value="rangeDate.value">
        {{ rangeDate.content }}
      </UiSelectItem>
      <UiSelectItem value="all-time">All time</UiSelectItem>
      <UiSelectItem value="custom">Custom</UiSelectItem>
    </UiSelectContent>
  </UiSelect>
  <UiPopover v-if="(selectedDate === 'custom') || (selectDate === 'custom')">
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
      <UiRangeCalendar v-model="value" initial-focus :is-date-disabled="isDateDisabled" :number-of-months="2"
        @update:start-value="(startDate) => (value.start = startDate)" />
    </UiPopoverContent>
  </UiPopover>
</template> -->
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
  // dateFormat.value.start = props.from;
  // dateFormat.value.end = props.to;
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
  }
});

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