<template>
  <UiSelect @update:model-value="update">
    <UiSelectTrigger>
      <UiSelectValue placeholder="Select Range" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem
        v-for="item in items"
        :key="item.value"
        :value="item.value.toString()"
      >
        {{ item.label }}
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>

<script setup lang="ts">
  import {
    getLocalTimeZone,
    today,
    startOfWeek,
    startOfMonth,
    startOfYear,
    CalendarDate,
    toCalendarDate,
  } from "@internationalized/date";

  const items = [
    { value: 0, label: "This Week" },
    { value: 1, label: "This Month" },
    { value: 2, label: "This Year" },
  ];

  const currentDate = ref(today(getLocalTimeZone()));

  const emit = defineEmits<{
    (event: "change", value: { start: CalendarDate; end: CalendarDate }): void;
  }>();

  const update = (value: string) => {
    switch (value) {
      case "0":
        const weekStart = startOfWeek(currentDate.value, "en-US");
        const weekEnd = weekStart.add({ days: 6 });
        emit("change", {
          start: toCalendarDate(weekStart),
          end: toCalendarDate(weekEnd),
        });
        break;
      case "1":
        const monthStart = startOfMonth(currentDate.value);
        const monthEnd = monthStart.add({ months: 1 });
        emit("change", {
          start: toCalendarDate(monthStart),
          end: toCalendarDate(monthEnd),
        });
        break;
      case "2":
        const yearStart = startOfYear(currentDate.value);
        const yearEnd = yearStart.add({ years: 1 });
        emit("change", {
          start: toCalendarDate(yearStart),
          end: toCalendarDate(yearEnd),
        });
        break;
    }
  };
</script>
