<template>
  <UiDialog v-model:open="modalState.open">
    <UiDialogContent
      :class="
        cn(
          'max-h-[80vh] max-w-[300px] overflow-y-auto rounded-lg px-3 sm:max-h-[80vh] sm:max-w-[300px] sm:px-3 md:max-h-[85vh] md:max-w-[425px] md:px-5 lg:max-h-[90vh] lg:max-w-[425px] lg:px-5 xl:max-h-[90vh] xl:max-w-[425px] xl:px-5',
          props.class,
        )
      "
    >
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
      class?: string;
    }>(),
    {
      title: "",
      class: "",
    },
  );
  watch(
    () => props.class,
    (newValue) => {
      console.log({ newValue });
    },
    { deep: true },
  );
</script>
