<template>
  <div>
    <UiSelect v-model="selectedStatus">
      <UiSelectTrigger class="w-[110px]">
        <UiSelectValue placeholder="Select category" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem value="all">All</UiSelectItem>
        <UiSelectItem value="true">Active</UiSelectItem>
        <UiSelectItem value="false">In active</UiSelectItem>
      </UiSelectContent>
    </UiSelect>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['change'])
const selectedStatus = ref('all')

watch(selectedStatus, (newValue) => {
  emit('change', newValue)
});
</script>