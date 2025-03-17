<template>
  <UiDialog v-model:open="modalState.open">
    <UiDialogContent :class="cn(
      'min-h-[60vh] max-h-[90vh] min-w-[700px] overflow-y-auto rounded-lg pt-0 px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0',
      props.class,
    )
      ">
      <UiDialogHeader describedby="dialog-description" class="px-5 pt-0 pb-0">
        <UiDialogTitle class="text-[#09090B] font-bold text-[26px]">{{ props?.title }}</UiDialogTitle>
        <DialogDescription class="text-[#71717A] text-[14px]">{{ props.description }}</DialogDescription>
      </UiDialogHeader>
      <UiSeparator orientation="horizontal" class="bg-[#E2E8F0] w-full" />
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
    description: string,
  }>(),
  {
    title: "",
    description: "",
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
