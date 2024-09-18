<template>
  <UiSelect v-model="selectedDate">
    <UiSelectTrigger class="w-[130px]">
      <UiSelectValue placeholder="Select a Status" />
    </UiSelectTrigger>
    <UiSelectContent>
 <UiSelectItem value="all">All Leads</UiSelectItem>
       <UiSelectItem
        v-for="(rangeDate, index) in dateFilters"
        :key="index"
        :value="rangeDate.value"
      >
        {{ rangeDate.content }}
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>
<script setup lang="ts">
  const emit = defineEmits(["change"]);
  const dateFilters = reactive([
    {
      content: "Junk",
      value: "junk",
    },
    {
      content: "New",
      value: "new",
    },
    {
      content: "Revisited",
      value: "revisited",
    },
    {
      content: "Site Visits",
      value: "site_visit",
    },
    {
      content: "Virtual Tours",
      value: "virtual_tour",
    },
    {
      content: "Location Visited",
      value: "location",
    },
    {
      content: "Call Scheduled",
      value: "schedule_call",
    },
  ]);
  const selectedDate = ref("all");

  watch(selectedDate, (newValue) => {
    emit("change", newValue);
  });
</script>
