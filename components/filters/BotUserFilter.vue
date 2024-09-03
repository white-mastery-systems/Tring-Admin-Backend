<script setup lang="ts">
const emit = defineEmits(["changeAction"]);
const selectedAction: any = ref('')
const actionFilters = reactive([
  {
    content: "With Name",
    value: "with_name",
  }, {
    content: "Without Name",
    value: "without_name",
  }
]);

watch(selectedAction, (newValue) => {
  emit("changeAction", newValue);
})
</script>

<template>
  <UiSelect v-model="selectedAction">
    <UiSelectTrigger class="w-[110px] sm:w-[110px] md:w-[250px] lg:w-[250px] xl:w-[250px]">
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