<script setup lang="ts">
const file = defineModel<HTMLInputElement["files"]>();

const props = defineProps<{ accept?: string }>();

const fileLen = computed(() => file.value?.length || 0);
// watch(file, (newFile: any, prevFile) => {
//   if (newFile?.length > 0) {
//
//     // $emit("uploadDocument");
//   }
// });
const fileIcon = computed(() =>
  fileLen.value > 1
    ? "ph:files-fill"
    : "material-symbols:upload-file-rounded",
);
const fileNames = computed(() => {
  if (!file.value) {
    return "";
  }
  return Array.from(file.value)
    .map((f) => f.name)
    .join(", ");
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <label for="dropzone-file"
      class="dark:hover:bg-bray-800 flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <div v-if="!file" class="px-4 text-center">
            <!-- Drag & Drop files here, or -->
            <div>
              click
            </div>
            <div class="text-[#64748B] text-[14px]">
              Supported file types: .pdf
            </div>
          </div>
          <!-- <svg class="h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 20 16" v-if="!file">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg> -->
          <!-- <Icon v-else name="iconamoon:file-fill" class="h-8 w-8 text-gray-500 dark:text-gray-400" /> -->

          <Icon v-else name="svg-spinners:90-ring-with-bg" class="h-8 w-8 animate-spin text-[#424bd1]" />
        </div>
      </div>
      <!-- @vue-ignore -->
      <input id="dropzone-file" type="file" class="hidden" :accept="accept" @change="
        (event) => {
          file = event.target.files;
          $emit('uploadDocument');
        }
      " v-bind="$attrs" />
    </label>
    <!-- <div class="flex flex-col items-center justify-center px-4 pb-6 pt-5">
      <label for="dropzone-file"
        class="mb-2 line-clamp-3 w-fit cursor-pointer text-center text-sm text-gray-500 dark:text-gray-400">
        {{ file && file.length > 0 ? fileNames : "Upload File" }}
      </label>
    </div> -->
  </div>
</template>
