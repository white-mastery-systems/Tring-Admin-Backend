<template>
  <div :class="cn('w-full', props?.endIcon ? 'relative' : '')">
    <UiLabel :class="['capitalize flex items-center', errorMessage ? 'text-red-500' : '']" v-if="label"
      :for="replacedId">
      {{ label }}
      <span v-if="required" class="text-lg text-red-500">*
      </span>


    </UiLabel>
    <UiTextarea v-if="isTextarea" class='mt-2' @keypress="(e: any) => {
      if (disableCharacters) {
        if (e.key === 'Enter') {
          return;
        }
        if (isNaN(e.key)) {
          e.preventDefault();
        }
      }
    }

      " :placeholder="placeholder" :id="replacedId" :class="errorMessage ? 'border-red-500' : 'border-input'"
      v-model="value" :type="type === 'phone' ? 'text' : type || 'text'" />

    <UiInput v-else :class="cn('mt-2', props.class, errorMessage ? 'border-red-500' : 'border-input')" @keypress="(e: any) => {
      if (disableCharacters) {
        if (e.key === 'Enter') {
          return;
        }
        if (isNaN(e.key)) {
          e.preventDefault();
        }
      }
    }" :maxlength="props?.type === 'phone' ? 10 : ''" :disabled="disabled" :placeholder="placeholder" :id="replacedId"
      v-model="value" :type="type || 'text'" />
    <div
      :class="cn(props?.endIcon ? 'absolute right-[10px] top-[38px] cursor-pointer' : 'absolute right-[10px] top-[38px]')">
      <slot name="endIcon"></slot>
    </div>

    <span :class="['text-xs text-gray-500', errorMessage ? ' text-red-500 font-medium' : '']">{{ errorMessage ??
      helperText
      }}</span>
  </div>
</template>

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
  isTextarea?: boolean;
  disabled?: boolean;
  class?: string;
  endIcon?: any;
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
console.log({ props: props.type })
const replacedId = ref(props.label ?? props.name)
const { value, errorMessage }: { value: any, errorMessage: any } = useField(() => props.name);

watch(errorMessage, (newErr) => {
  console.log({ newErr })
})
watch(value, (value) => {
  console.log({ value })
})

</script>