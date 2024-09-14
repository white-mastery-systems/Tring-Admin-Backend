<script setup lang="ts">
const emit = defineEmits(["changeAction"]);
const selectedAction: any = ref('all')
const actionFilters = reactive([
  {
    content: "Live",
    value: "live",
  }, {
    content: "Preview",
    value: "preview",
  },
]);

watch(selectedAction, (newValue) => {
  emit("changeAction", newValue);
})
</script>

<template>
  <UiSelect v-model="selectedAction">
    <UiSelectTrigger class="w-[150px]">
      <UiSelectValue placeholder="Select a User" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem value="all">All</UiSelectItem>
      <UiSelectItem v-for="(list, index) in actionFilters" :key="index" :value="list.value">
        {{ list.content }}
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>