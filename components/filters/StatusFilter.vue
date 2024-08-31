<template>
  <UiSelect v-model="selectedDate">
    <UiSelectTrigger class="w-[110px] sm:w-[110px] md:w-[250px] lg:w-[250px] xl:w-[250px]">
      <UiSelectValue placeholder="Select a Status" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem value="all">All</UiSelectItem>
      <UiSelectItem v-for="(rangeDate, index) in dateFilters" :key="index" :value="rangeDate.value">
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
  }, {
    content: "New",
    value: "new",
  },{
    content: "Revisited",
    value: "revisited",
  },
]);
const selectedDate = ref('all')


watch(selectedDate, (newValue) => {
  emit("change", newValue);
})
</script>
