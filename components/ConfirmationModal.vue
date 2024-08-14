<script setup lang="ts">
  interface Props {
    title: string;
    description: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: "",
    description: "",
  });

  const emit = defineEmits<{ (e: "confirm"): void }>();

  const open = defineModel<boolean>("open", { default: false, required: true });
</script>

<template>
  <UiAlertDialog v-model:open="open">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>{{ title }}</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          {{ description }}
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel >Cancel</UiAlertDialogCancel>
        <UiAlertDialogAction @click="$emit('confirm')" class="bg-[#424bd1] text-white hover:bg-[#424bd1]/90"
          >Confirm</UiAlertDialogAction
        >
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
