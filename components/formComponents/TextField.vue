<template>
  <UiFormField v-bind="fieldAttrs" :name="name">
    <UiFormItem class="w-full">
      <UiFormLabel
        >{{ label }} <UiLabel class="text-lg text-red-700">*</UiLabel>
      </UiFormLabel>
      <UiFormControl>
        <UiInput
          :class="error ? 'border-red-700' : ''"
          type="text"
          v-bind="fieldAttrs"
          @input="updateField($event.target.value)"
          :placeholder="placeHolder"
        />
      </UiFormControl>
      <p v-if="error" class="mt-0 text-sm text-red-700">{{ error }}</p>
      <!-- <UiFormMessage v-model="name" v-bind="nameAttrs" /> -->
      <span class="text-xs text-gray-500"
        >Enter a unique identification for CRM integration</span
      >
    </UiFormItem>
  </UiFormField>
</template>
<script setup lang="ts">
  const { label, field, fieldAttrs, error } = defineProps<{
    label: string;
    field: any;
    fieldAttrs: any;
    error: string | undefined;
    name: string;
    placeHolder: string;
  }>();

  const emit = defineEmits(["update:field"]);

  const updateField = (value: any) => {
    emit("update:field", value); // Emit the event to update the field prop
  };
</script>
