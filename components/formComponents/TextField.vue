<template>
  <div class="w-full">
    <UiLabel :class="['capitalize flex items-center', errorMessage ? 'text-red-500' : '']" v-if="label"
      :for="replacedId">
      {{ label }}
      <span v-if="required" class="text-sm text-red-700">*
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
      v-model="value" :type="type || 'text'" />

    <UiInput  v-else class='mt-2' @keypress="(e: any) => {
      if (disableCharacters) {
        if (e.key === 'Enter') {
          return;
        }
        if (isNaN(e.key)) {
          e.preventDefault();
        }
      }
    } "
      :disabled="disabled"
    :placeholder="placeholder" :id="replacedId" :class="errorMessage ? 'border-red-500' : 'border-input'"
      v-model="value" :type="type || 'text'" />

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
  isTextarea: boolean;
  disabled?: boolean
}>(), {
  label: '',
  type: 'text',
  helperText: '',
  placeholder: '',
  required: false,
  disableCharacters: false,
  isTextarea: false,
  disabled: false
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
