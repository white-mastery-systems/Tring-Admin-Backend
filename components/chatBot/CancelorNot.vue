# components/AlertDialog.vue
<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

defineProps<Props>();

const emit = defineEmits(['confirm', 'cancel']);
const open = defineModel<boolean>('open');

const onConfirm = () => {
  emit('confirm');
  if (open.value !== undefined) { 
    open.value = false;
  }
};

const onCancel = () => {
  emit('cancel');
  if (open.value !== undefined) {
    open.value = false;
  }
};
</script>

<template>
  <UiAlertDialog :open="!!open" @update:open="$emit('update:open', $event)">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>{{ title || 'Leave Page?' }}</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          {{ description || 'Are you sure you want to leave? Any unsaved changes will be lost.' }}
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="onCancel">No, Stay</UiAlertDialogCancel>
        <UiAlertDialogAction @click="onConfirm" class="bg-[#ff0000] text-white hover:bg-[#ff0000]/90">
          Yes, Exit
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>