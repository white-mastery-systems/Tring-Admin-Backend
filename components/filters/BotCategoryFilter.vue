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
const emit = defineEmits(['change'])
const selectedCategory = ref('all')
const categories = ref(botTypes)

watch(selectedCategory ,(newValue) => {
  emit('change', newValue)
});
</script>