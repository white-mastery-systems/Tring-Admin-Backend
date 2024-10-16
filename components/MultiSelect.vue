<template>
  <div class="space-y-2">
    <div class="pb-[1px] text-gray-700 w-full font-medium" :class="{ 'text-red-500': errorMessage }">
      {{ label }} <span v-if="required" class="pb-0 text-red-500 font-medium text-[18px]">*</span>
    </div>
    <multiselect v-model="internalValue" :options="options" selectLabel="" selectedLabel="" deselectLabel=""
      :multiple="true" :close-on-select="false" :clear-on-select="false" :max-height="150" :preserve-search="true"
      :placeholder="placeholder" openDirection="bottom" label="name" track-by="value" class="w-full mb-5"
      :append-to-body="true">
      <!-- Custom selected values -->
      <template #selection="{ values, isOpen }">
        <span class="text-sm font-medium" v-if="values.length && !isOpen">
          {{ values.length }} contacts selected
        </span>
      </template>

      <!-- Custom option template with checkboxes -->
      <template #option="{ option, selected }">
        <div class="flex items-center gap-2 px-4 py-0 cursor-pointer">
          <input type="checkbox" :checked="internalValue.map((item: any) => item.value).includes(option.value)"
            class="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded" />
          <span class="text-sm font-medium">{{ option.name }}</span>
        </div>
      </template>
    </multiselect>
    <span :class="['text-xs text-gray-500', errorMessage ? 'font-medium text-red-500' : '']">{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { useField } from 'vee-validate';

// Props to receive value and options from the parent
const props = withDefaults(
  defineProps<{
    modelValue: Array<string>; // This should only accept string values
    options: Array<{ value: string; name: string }>; // Define the structure of options
    name: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
  }>(),
  {
    modelValue: () => [],
    label: '',
    required: false,
    placeholder: '',
  }
);

// Emit event to notify parent of changes
const emit = defineEmits(['update:modelValue']);

const { value: fieldValue, errorMessage } = useField(props.name);

const internalValue = ref<string[]>([...props.modelValue]);

watch(internalValue, (newValue) => {
  if (!arraysEqual(newValue, props.modelValue)) {
    fieldValue.value = newValue;
    emit('update:modelValue', newValue);
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = [...newVal];
  }
);

const arraysEqual = (a: any, b: any) => {
  if (a.length !== b.length) return false;
  return a.every((value: any, index: number) => value === b[index]);
};
</script>
<style scoped>
:deep(.multiselect__placeholder) {
  color: grey !important;
}
</style>