<template>
  <UiSelect v-model="selectedTemplate">
    <UiSelectTrigger class="w-[200px]">
      <UiSelectValue placeholder="Select Integration" />
    </UiSelectTrigger>
    <UiSelectContent>
      <UiSelectItem
        v-for="(integrationList, index) in integrationsData"
        :key="index"
        :value="integrationList.id"
      >
        {{ integrationList.name }}
      </UiSelectItem>
    </UiSelectContent>
  </UiSelect>
</template>
<script setup lang="ts">
  const emit = defineEmits(["change"]);
  const {
    status: integrationLoadingStatus,
    data: integrationsData,
    refresh: integrationRefresh,
  } = useLazyFetch("/api/org/integrations", {
    server: false,
    query: { q: "channel" },
    default: () => [],
  });

  const selectedTemplate = ref();

  watch(integrationsData, (newData) => {
    if (newData && newData.length > 0) {
      selectedTemplate.value = newData[0].id;
      emit("change", newData[0].id)
    }
  }, {immediate: true});

  watch(selectedTemplate, (newValue) => {
    emit("change", newValue);
  });
</script>
