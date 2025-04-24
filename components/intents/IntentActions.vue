<script setup lang="ts">
  interface Emits {
    (e: "delete", payload: string): void;
    (e: "edit", payload: string): void;
  }
  interface Props {
    id: string;
  }

  defineProps<Props>();
  defineEmits<Emits>();

  const isDeleteModalOpen = ref(false);
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger>
      <Icon name="ri:more-fill" class="h-5 w-5" />
    </UiPopoverTrigger>
    <UiPopoverContent align="center" class="w-full space-y-2">
      <UiButton
        variant="destructive"
        class="w-full"
        @click="isDeleteModalOpen = true"
      >
        Delete
      </UiButton>
    </UiPopoverContent>
  </UiPopover>
  <ConfirmationModal
    v-model:open="isDeleteModalOpen"
    title="Confirm Delete"
    description="Are you sure you want to delete ?"
    @confirm="$emit('delete', id)"
  />
</template>
