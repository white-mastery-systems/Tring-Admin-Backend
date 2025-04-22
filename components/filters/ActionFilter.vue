<script setup lang="ts">
  const emit = defineEmits(["changeAction"]);
  const selectedAction: any = ref("");
  const actionFilters = reactive([
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
      content: "Call Schedule",
      value: "schedule_call",
    },
  ]);

  watch(selectedAction, (newValue) => {
    emit("changeAction", newValue);
  });
</script>
<template>
  <UiSelect v-model="selectedAction">
    <UiSelectTrigger class="w-[200px]">
      <UiSelectValue placeholder="Select a Action" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem value="all">All</UiSelectItem>
      <UiSelectItem
        v-for="(list, index) in actionFilters"
        :key="index"
        :value="list.value"
      >
        {{ list.content }}
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>
