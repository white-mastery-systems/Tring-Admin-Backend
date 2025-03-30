<!-- <template>
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
</script> -->
<template>
  <div>
    <UiSelect v-model="selectedDate">
      <UiSelectTrigger class="min-w-[130px] max-w-[130px] text-start">
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
  </div>
</template>
<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: String,
      default: 'all',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const dateFilters = reactive([
    { content: "Junk", value: "junk" },
    { content: "New", value: "new" },
    { content: "Revisited", value: "revisited" },
    { content: "Site Visits", value: "site_visit" },
    { content: "Virtual Tours", value: "virtual_tour" },
    { content: "Location Visited", value: "location" },
    { content: "Call Scheduled", value: "schedule_call" },
  ]);

  // The modelValue will bind to selectedDate
  const selectedDate = ref(props.modelValue);

  // Whenever selectedDate changes, emit the updated value to the parent
  watchEffect(() => {
    selectedDate.value = props.modelValue;
  });
  watch(selectedDate, (newValue) => {
    emit('update:modelValue', newValue);
  });
</script>
