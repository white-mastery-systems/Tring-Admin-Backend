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
  endIcon?: any
}>(), {
  label: '',
  type: 'text',
  helperText: '',
  placeholder: '',
  required: false,
  disableCharacters: false,
  isTextarea: false,
  disabled: false,
  class: ''
});
const replacedId = ref(props.label ?? props.name)
const { value, errorMessage }: { value: any, errorMessage: any } = useField(() => props.name);

watch(errorMessage, (newErr) => {
  console.log({ newErr })
})
watch(value, (value) => {
  console.log({ value })
})

</script>
<template>
  <div class="flex flex-col justify-start items-center gap-2 font-medium">
    <label :for="name" class="pb-[1px] text-gray-700 w-[70%]" :class="(errorMessage) ? 'text-red-500' : ''">
      {{ label }} <span class="pb-2 text-red-500 font-medium text-[18px]">*</span>
    </label>
    <input v-model="value" type="time" :id="name" :class="[
      'border-[1px] border-solid rounded-[6px] py-[8px] px-2 font-normal text-[14px]',
    ]">
    <p v-if="errorMessage" class="text-red-500 text-[13px]">{{ errorMessage }}</p>
  </div>
</template>