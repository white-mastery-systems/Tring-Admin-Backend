<template>
  <div>
    <UiSelect v-model="selectedCategory">
      <UiSelectTrigger class="w-[180px]">
        <UiSelectValue placeholder="Select category" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectItem value="all">All Category</UiSelectItem>
        <UiSelectItem v-for="(category, index) in categories" :key="index" :value="category.value">
          {{ category.label }}
        </UiSelectItem>
        <UiSelectItem value="other">Other</UiSelectItem>
      </UiSelectContent>
    </UiSelect>
  </div>
</template>
<script setup lang="ts">
import { botTypes } from '~/composables/botManagement/chatBot/useBotType'
  const props = defineProps({
    modelValue: {
      type: String,
      default: "all",
    },
  });
const emit = defineEmits(["update:modelValue"]);
const selectedCategory = ref(props.modelValue)
const categories = ref(botTypes)


watchEffect(() => {
  selectedCategory.value = props.modelValue;
})
watch(selectedCategory ,(newValue) => {
  emit("update:modelValue", newValue);
});
</script>