<!-- CustomSelect.vue -->
<template>
  <UiFormField v-model="selectedValue" :name="name">
    <UiFormItem class="w-full">
      <UiFormLabel :class="{ 'text-[#ef4444]': hasError }">
        {{ label }}<UiLabel v-if="required" class="text-lg text-red-500">*</UiLabel>
      </UiFormLabel>
      <UiFormControl>
        <UiSelect class="focus:ring focus:outline outline-2" v-model="selectedValue" v-bind="$attrs">
          <UiSelectTrigger :class="['focus:ring',hasError ? 'border-[#ef4444]' : '']">
            <UiSelectValue :placeholder="placeholder" />
          </UiSelectTrigger>
          <UiSelectContent>
            <template v-for="option in options" :key="option.value">
 <UiSelectItem  :value="option.value">
              {{ option.label }}
            </UiSelectItem>
               <span v-if="option?.helperText" class="mx-2 text-xs italic text-gray-500">{{option?.helperText}}</span>
         
            </template>
            </UiSelectContent>
        </UiSelect>
      </UiFormControl>
      <UiFormMessage class="text-xs text-red-500 "/>
      <span v-if="hasError" class="mt-0 text-xs text-[#ef4444]">{{ errorMessage }}</span>
      <span v-else class="mt-0 text-xs text-gray-500">{{ helperText }}</span>

    </UiFormItem>
  </UiFormField>
</template>

<script setup>
import { useField } from 'vee-validate';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  options: {
    type: Array,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  helperText: {
    type: String
  }
 
});

const { value: fieldValue, errorMessage, meta } = useField(() => props.name);
// watch([errorMessage,fieldValue],(err)=>{
//   console.log({err})
// })
const selectedValue = ref(fieldValue.value);

watch(selectedValue, (newValue) => {
  fieldValue.value = newValue;
});

const hasError = computed(() => meta.touched && errorMessage.value);

</script>