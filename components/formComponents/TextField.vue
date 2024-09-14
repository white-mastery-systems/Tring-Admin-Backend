<!-- TextField.vue -->
<template>
  <UiFormField :name="name">
    <UiFormItem class="w-full">
      <UiFormLabel>
        {{ label }}
        <UiLabel v-if="required" class="text-lg text-red-700">*</UiLabel>
      </UiFormLabel>
      <UiFormControl>
        <UiInput
          :class="{ 'border-red-700': !!errorMessage }"
          type="text"
          :name="name"
          :value="modelValue"
          @input="updateValue"
          :placeholder="placeholder"
        />
      </UiFormControl>
      <UiFormMessage>
        {{ errorMessage || helperText }}
      </UiFormMessage>
    </UiFormItem>
  </UiFormField>
</template>

<script setup lang="ts">
  import { useField } from "vee-validate";

  const props = defineProps<{
    name: string;
    label: string;
    modelValue: string | undefined;
    placeholder?: string;
    helperText?: string;
    required?: boolean;
  }>();

  const emit = defineEmits(["update:modelValue"]);

  const { value, errorMessage } = useField(props.name, undefined, {
    initialValue: props.modelValue,
  });

  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
    value.value = target.value;
  };
</script>
