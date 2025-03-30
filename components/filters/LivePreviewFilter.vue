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
  {
    content: "With Name",
    value: "with_name",
  }, {
    content: "Without Name",
    value: "without_name",
  }, {
    content: "Interacted",
    value: "interacted",
  }
]);

watch(selectedAction, (newValue) => {
  emit("changeAction", newValue);
})
</script>

<template>
  <UiSelect v-model="selectedAction">
    <UiSelectTrigger class="min-w-[130px] max-w-[130px]">
      <UiSelectValue placeholder="Select a User" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem value="all">All Chats</UiSelectItem>
      <UiSelectItem v-for="(list, index) in actionFilters" :key="index" :value="list.value">
        {{ list.content }}
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>