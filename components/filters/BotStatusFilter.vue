<template>
  <div>
    <UiSelect v-model="selectedStatus">
      <UiSelectTrigger class="min-w-[130px] max-w-[130px]">
        <UiSelectValue placeholder="Select Status" />
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
  const props = defineProps({
    modelValue: {
      type: String,
      default: "all",
    },
  });
const emit = defineEmits(["update:modelValue"]);
const selectedStatus = ref(props.modelValue)
watchEffect(() => {
  selectedStatus.value = props.modelValue;
})
watch(selectedStatus, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>