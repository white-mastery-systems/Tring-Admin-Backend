<script setup lang="ts">
import { useField } from 'vee-validate';

const props = withDefaults(defineProps<{
  label?: string;
  name: string;
  type?: string;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  disableCharacters?: boolean;
  isTextarea: boolean;
  disabled?: boolean;
  class?: string;
  endIcon?: any;
  validation:boolean;
}>(), {
  label: '',
  type: 'text',
  helperText: '',
  placeholder: '',
  required: false,
  disableCharacters: false,
  isTextarea: false,
  disabled: false,
  class: '',
  validation:true
});
const replacedId = ref(props.label ?? props.name)
const { value, errorMessage }: { value: any, errorMessage: any } = !props.validation ?  {value:props.name,errorMessage:''}:useField(() => props.name);

watch(errorMessage, (newErr) => {
  console.log({ newErr })
})
watch(value, (value) => {
  console.log({ value })
})

</script>
<template>
  <div class="flex flex-col justify-start items-center gap-2 font-medium w-full">
    <label :for="name" class="pb-[1px] text-gray-700 w-full text-sm" :class="(errorMessage) ? 'text-red-500' : ''">
      {{ label }} <span v-if="required" class="pb-2 text-red-500 font-medium text-[18px]">*</span>
    </label>
    <input v-model="value" type="time" :id="name" class="w-full" :readonly="disabled" :class="[
      'border-[1px] border-solid rounded-[6px] py-[8px] px-2 font-normal text-[14px]',
    ]">
    <p v-if="errorMessage" class="text-red-500 text-[13px] w-full">{{ errorMessage }}</p>
  </div>
</template>