<script setup lang="ts">
import { Download } from 'lucide-vue-next';
const file = defineModel<HTMLInputElement["files"]>(); // Define v-model support
const emit = defineEmits<{ (e: "uploadDocument"): void }>();

const triggerFileUpload = () => {
  const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
  fileInput.value = ''; // Clear the input value
  fileInput.click();
};
</script>

<template>
  <div class="flex w-full items-center">
    <input id="dropzone-file" type="file" class="hidden"
      accept=".csv, .xls, .xlsx, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      @change="(event: any) => {
        file = event.target.files;
        $emit('uploadDocument');
      }" />
    <UiButton color="primary" @click="triggerFileUpload" :loading="isLoading">
      <div class="flex items-center justify-between">
        <Download class="mr-2 h-4 w-4" />
        <span class="font-medium text-[14px]"> Import Contacts </span>
      </div>
    </UiButton>
  </div>
</template>