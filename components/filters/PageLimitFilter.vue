<script setup lang="ts">
  const emit = defineEmits(["changeAction"]);
  const selectedAction: any = ref("8");
  const actionFilters = reactive([
    {
      content: "Eight Per Page",
      value: "8",
    },
    {
      content: "Fifteen Per Page",
      value: "15",
    },
    {
      content: "Twenty Five Per Page",
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
