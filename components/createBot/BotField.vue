<script setup lang="ts">
  defineProps<{ label: string; name: string }>();
</script>

<template>
  <UiFormField v-slot="{ componentField }" :name="name">
    <UiFormItem v-auto-animate="{ duration: 750 }">
      <UiFormLabel>{{ label }}</UiFormLabel>
      <UiFormControl>
        <slot :field="componentField" />
      </UiFormControl>
      <UiFormMessage />
    </UiFormItem>
  </UiFormField>
</template>
