<template>
  <UiDialog v-model:open="modalState.open">
    <UiDialogContent class="sm:max-w-[425px]">
      <UiDialogHeader describedby="dialog-description">
        <UiDialogTitle>{{ props?.title }}</UiDialogTitle>
      </UiDialogHeader>
      <slot></slot>
    </UiDialogContent>
  </UiDialog>
</template>
<script setup lang="ts">
  const modalState = defineModel<{ open: boolean }>({
    default: { open: false },
    required: true,
  });
  const props = withDefaults(
    defineProps<{
      title: string;
    }>(),
    {
      title: "",
    },
  );
</script>
