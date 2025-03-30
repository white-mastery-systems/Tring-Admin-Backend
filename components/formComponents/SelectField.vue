<!-- CustomSelect.vue -->
<template>
  <UiFormField v-model="selectedValue" :name="name">
    <UiFormItem class="w-full">
      <UiFormLabel :class="{ 'text-[#ef4444]': hasError }">
        {{ label }}<UiLabel v-if="required" class="text-lg text-red-500">*</UiLabel>
      </UiFormLabel>
      <UiFormControl>
        <UiSelect :class="cn(props.class)" :multiple="multiple" class="mt-2 focus-visible:ring" v-model="selectedValue"
          v-bind="$attrs" :disabled="props.disabled">
          <div class="relative flex items-center">
            <UiSelectTrigger :class="[hasError ? 'border-[#ef4444]' : '']" class="text-start">
              <UiSelectValue class="text-[12px] sm:text-[12px] md:text-[14px]" :placeholder="placeholder" />
            </UiSelectTrigger>
            <CloseIcon v-if="selectedValue && closeIcon" class="absolute right-10 w-4 h-4 cursor-pointer"
              @click="clearSelectedValue" />
          </div>
          <!-- <UiSelectTrigger :class="[hasError ? 'border-[#ef4444]' : '']">
            <UiSelectValue :placeholder="placeholder" />
            <CloseIcon class="w-4 h-4" @click.stop="clearSelectedValue" />
          </UiSelectTrigger> -->
          <UiSelectContent>
            <template v-for="option in options" :key="option.value">
              <UiSelectItem :value="option.value" class="flex justify-start">
                {{ option.label }}
              </UiSelectItem>
              <span v-if="option?.helperText" class="mx-2 text-xs italic text-gray-500 py-0">{{ option?.helperText
                }}</span>

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
import CloseIcon from "~/components/icons/CloseIcon.vue";
const props = withDefaults(defineProps<{
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
  closeIcon?: boolean
  disabled: boolean
}>(), {
  closeIcon: false,
  disabled: false,
});
const { value: fieldValue, errorMessage, meta, errors } = useField(() => props.name);

const selectedValue = ref<any>(fieldValue.value);
const emit = defineEmits(['input']);
watch(selectedValue, (newValue) => {
  fieldValue.value = newValue;
  emit('input', newValue);
});

const hasError = computed(() => meta.touched && errorMessage.value);
// const data = computed(() => errors.value)

const clearSelectedValue = () => {
  selectedValue.value = props.multiple ? [] : ""; // Clear based on multiple or single select
};
</script>