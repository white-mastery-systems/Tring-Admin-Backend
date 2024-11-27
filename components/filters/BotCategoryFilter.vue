<template>
  <div>
    <UiSelect v-model="selectedCategory">
       <UiSelectTrigger class="w-[180px]">
         <UiSelectValue placeholder="Select category" />
       </UiSelectTrigger>
       <UiSelectContent>
          <!-- <UiSelectItem value="all">All Category</UiSelectItem> -->
          <UiSelectItem
            v-for="(category, index) in categories"
            :key="index"
            :value="category.value"
          >
            {{ category.content }}
          </UiSelectItem>
       </UiSelectContent>
    </UiSelect>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['change'])
const selectedCategory = ref('')
const categories = reactive([
  { value: 'government-sectors', content: 'Government Sectors' },
  { value: 'finance-banking', content: 'Finance & Banking' },
  { value: 'real-estate', content: 'Real Estate' },
  { value: 'healthcare', content: 'Healthcare' },
  { value: 'ecommerce', content: 'E-commerce' },
  { value: 'energy-utilities', content: 'Energy & Utilities' },
  { value: 'telecommunications', content: 'Telecommunications' },
  { value: 'travel-hospitality', content: 'Travel & Hospitality' },
  { value: 'logistics', content: 'Logistics' },
  { value: 'education', content: 'Education' },
  { value: 'other', content: 'Other' },
])

watch(selectedCategory ,(newValue) => {
  emit('change', newValue)
});
</script>