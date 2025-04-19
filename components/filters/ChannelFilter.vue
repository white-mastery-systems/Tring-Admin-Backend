<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: "all",
  },
});

  const emit = defineEmits(["update:modelValue"]);
  const selectedAction: any = ref(props.modelValue);

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

watchEffect(() => {
  selectedAction.value = props.modelValue;
});

  watch(selectedAction, (newValue) => {
    emit("update:modelValue", newValue);
  },{deep: true, immediate: true});
</script>

<template>
  <div>
    <UiSelect v-model="selectedAction">
      <UiSelectTrigger class="min-w-[130px] max-w-[130px]">
        <UiSelectValue placeholder="Select a Channel" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem v-for="(list, index) in actionFilters" :key="index" :value="list.value">
          {{ list.content }}
        </UiSelectItem>
      </UiSelectContent>
    </UiSelect>
  </div>
</template>
