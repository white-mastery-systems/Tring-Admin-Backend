<template>
  <UiDialog v-model:open="modalState.open">
    <UiDialogContent
      :class="cn('max-w-[300px] sm:max-w-[300px] md:max-w-[425px] lg:max-w-[425px] xl:max-w-[425px] max-h-[80vh] sm:max-h-[80vh] md:max-h-[85vh] lg:max-h-[90vh] xl:max-h-[90vh] overflow-y-auto rounded-lg px-3 sm:px-3 md:px-5 xl:px-5 lg:px-5')">
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
