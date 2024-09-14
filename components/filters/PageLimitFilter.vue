<script setup lang="ts">
  const emit = defineEmits(["changeAction"]);
  const selectedAction: any = ref("10");
  const actionFilters = reactive([
    {
      content: "10",
      value: "10",
    },
    {
      content: "15",
      value: "15",
    },
    {
      content: "25",
      value: "25",
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
