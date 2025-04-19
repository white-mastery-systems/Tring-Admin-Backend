<script setup lang="ts">
const file = defineModel<HTMLInputElement["files"]>();

const props = defineProps<{ accept?: string }>();

const fileLen = computed(() => file.value?.length || 0);
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
      class="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 dark:hover:border-gray-500">
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <div v-if="!file" class="px-4 text-center">
            <!-- Drag & Drop files here, or -->
              <div>
                Upload file
              </div>
              <div class="text-[#64748B] text-[14px]">
                Supported file types: .pdf
              </div>
            </div>
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
  </div>
</template>
