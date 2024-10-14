<script setup lang="ts">
import { Upload, File } from 'lucide-vue-next';
const file = defineModel<HTMLInputElement["files"]>(); // Define v-model support

const props = defineProps<{ accept?: string }>(); // Allow accept prop for file types

const emit = defineEmits<{ (e: "uploadDocument"): void }>();
const fileLen = computed(() => file.value?.length || 0);

const fileIcon = computed(() =>
  fileLen.value > 1 ? "ph:files-fill" : "material-symbols:upload-file-rounded",
);

const fileNames = computed(() => {
  if (!file.value) {
    return "";
  }
  return Array.from(file.value)
    .map((f) => f.name)
    .join(", ");
});

// // Emit custom event when file changes
// const emitFileChange = () => {
//   emit('uploadDocument'); // Emit the event
// };
</script>

<template>
  <div class="flex w-full items-center">
    <input id="dropzone-file" type="file" class="hidden"
      accept=".csv, .xls, .xlsx, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      @change="(event: any) => {
      file = event.target.files;
      $emit('uploadDocument');
    }" />
    <label for="dropzone-file"
      class="flex-1 cursor-pointer rounded-md border border-[#e5e5e5] bg-white p-[8.5px] text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
      <div class="flex items-center justify-between">
        <File class="mr-2 h-4 w-4" />
        <span class="font-medium text-[14px]"> Import File </span>
        <!-- <span class="font-medium text-[14px]">{{ fileLen > 0 ? fileNames : "Upload File" }}</span> -->
        <!-- <span class="material-icons">
          {{ fileLen > 1 ? "ph:files-fill" : "material-symbols:upload-file-rounded" }}
        </span> -->
      </div>
    </label>
  </div>
</template>
