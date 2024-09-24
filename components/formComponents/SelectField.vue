<!-- CustomSelect.vue -->
<template>
  <UiFormField v-model="selectedValue" :name="name">
    <UiFormItem class="w-full">
      <UiFormLabel :class="{ 'text-[#ef4444]': hasError }">
        {{ label }}<UiLabel v-if="required" class="text-lg text-red-500">*</UiLabel>
      </UiFormLabel>
      <UiFormControl>
        <UiSelect :class="cn(props.class)" :multiple="multiple" class="mt-2 focus-visible:ring" v-model="selectedValue"
          v-bind="$attrs">
          <UiSelectTrigger :class="[hasError ? 'border-[#ef4444]' : '']">
            <UiSelectValue :placeholder="placeholder" />
          </UiSelectTrigger>
          <UiSelectContent>
            <template v-for="option in options" :key="option.value">
              <UiSelectItem :value="option.value">
                {{ option.label }}
              </UiSelectItem>
              <span v-if="option?.helperText" class="mx-2 text-xs italic text-gray-500">{{ option?.helperText }}</span>

            </template>
          </UiSelectContent>
        </UiSelect>
      </UiFormControl>
      <UiFormMessage class="text-xs text-red-500 " />
      <span v-if="hasError" class="mt-0 text-xs text-[#ef4444]">{{ errorMessage }}</span>
      <span v-else class="mt-0 text-xs text-gray-500">{{ helperText }}</span>

    </UiFormItem>
  </UiFormField>
</template>

<script setup lang='ts'>
import { useField } from 'vee-validate';
import { computed, ref, watch } from 'vue';
// const options = defineModel('options')
// watch(options, (opt) => {
//   console.log({ opt })
// })

const props = defineProps<{
  name: string,
  label?: string,
  placeholder?: string,
  required?: boolean,
  helperText?: string,
  options: {
    label: string,
    value: string,
    helperText?: string
  }[],
  multiple?: boolean
  class: ''
}>();
watchEffect(() => {
  console.log({ options: props.options })
})
const { value: fieldValue, errorMessage, meta, errors } = useField(() => props.name);

const selectedValue = ref<any>(fieldValue.value);

watch(selectedValue, (newValue) => {
  fieldValue.value = newValue;
});

const hasError = computed(() => meta.touched && errorMessage.value);
// const data = computed(() => errors.value)
// console.log(data.value, "VALUE")
</script>