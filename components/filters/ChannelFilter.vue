<script setup lang="ts">
  const emit = defineEmits(["changeAction"]);
  const selectedAction: any = ref("all");
  const actionFilters = reactive([
    {
      content: "All",
      value: "all",
    },
    {
      content: "Whats App",
      value: "whatsapp",
    },
    {
      content: "Website",
      value: "website",
    },
  ]);

  watch(selectedAction, (newValue) => {
    emit("changeAction", newValue);
  });
</script>

<template >
  <UiSelect v-model="selectedAction" >
    <UiSelectTrigger class="w-[120px]">
      <UiSelectValue placeholder="Select a Channel" />
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
