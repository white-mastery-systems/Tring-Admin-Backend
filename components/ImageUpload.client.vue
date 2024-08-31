<script setup lang="ts">
  const props = defineProps<{
    initialFile: HTMLInputElement["files"] | string;
    accept?: string;
  }>();
  const file = ref<HTMLInputElement["files"] | string>(props.initialFile);
  const emit = defineEmits<{
    (e: "change", payload: HTMLInputElement["files"] | string): void;
  }>();

  const fileLen = computed(() => file.value?.length || 0);
  const fileIcon = computed(() =>
    fileLen.value > 1
      ? "ph:files-fill"
      : "material-symbols:upload-file-rounded",
  );
  const fileNames = computed(() => {
    if (!file.value || typeof file.value === "string") {
      return "";
    }
    return Array.from(file.value)
      .map((f) => f.name)
      .join(", ");
  });
  const _ = ref();

  watchEffect(() => {
    emit("change", file.value);
    if (!file.value) {
      return;
    }
    if (typeof file.value !== "string") {
      _.value = URL.createObjectURL(file.value[0]);
    } else {
      _.value = file.value;
    }
  });
</script>
<template>
  <!-- <pre>{{ file[0]?.name }}</pre> -->
  <div class="flex w-full items-center justify-center">
    <label
      for="dropzone-file"
      class="dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      :style="{
        backgroundImage:
          typeof file === 'string' ? `url(${file})` : `url(${_})`,
      }"
    >
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <svg
            class="h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
            v-if="!file"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
        </div>
      </div>
      <!-- @vue-ignore -->
      <input
        id="dropzone-file"
        type="file"
        class="hidden"
        :accept="accept"
        @change="file = $event.target.files"
        v-bind="$attrs"
      />
    </label>
    <div class="flex flex-col items-center justify-center px-4 pb-6 pt-5">
      <p
        class="mb-2 line-clamp-3 w-fit text-center text-sm text-gray-500 dark:text-gray-400"
      ></p>
    </div>
  </div>
</template>
