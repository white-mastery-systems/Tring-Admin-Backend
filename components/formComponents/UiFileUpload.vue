<template>
<div v-if="fileType === 'image'" class="w-full">
  <div class="flex w-full gap-4">
    <!-- Preview area - fixed size -->
    <div class="flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-lg border border-gray-300 overflow-hidden">
      <label for="imageView1" class="w-full h-full cursor-pointer">
        <div v-if="url?.length" class="w-full h-full flex items-center justify-center">
          <img :class="class" :src="url" alt="" class="object-cover w-full h-full rounded-lg" />
        </div>
        <div v-else class="w-full h-full flex flex-col items-center justify-center">
          <img :class="class" src="assets/icons/image_preview.svg" alt="" class="w-10 h-10" />
          <span class="text-[#71717A] text-xs mt-1">Preview</span>
        </div>
        <input class="hidden" type="file" @change="handleFileChange" :multiple="multiple" :accept="accept" id="imageView1" />
      </label>
    </div>
    
    <!-- Upload area - flexible width -->
    <div class="flex-1">
      <label
        class="dark:hover:bg-bray-800 flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat text-center hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 w-full">
        <span class="whitespace-nowrap flex flex-col items-center text-[8px] sm:text-[8px] md:text-[12px] italic text-[#000000]">
          {{ props.label || "Upload File" }}
          <span class="text-[6px] sm:text-[6px] md:text-[10px] text-gray-500" v-if="props?.helperText?.length">
            {{ props.helperText }}
          </span>
        </span>
        <input class="hidden" type="file" @change="handleFileChange" :multiple="multiple" :accept="accept" />
      </label>
      <span class="text-[14px] font-medium text-red-500" v-if="errorMessage">
        {{ errorMessage }}
      </span>
    </div>
  </div>
</div>

  <div v-else-if="fileType === 'file'">
    <div>
      <label
        class="dark:hover:bg-bray-800 flex h-24 max-w-[130px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat text-center hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <span class="whitespace-nowrap">
          {{ props.label || "Upload File" }}
        </span>
        <input class="hidden" type="file" @change="handleFileChange" :multiple="multiple" :accept="accept" />
      </label>
      <span class="text-sm text-gray-500" v-if="props?.helperText?.length && !url.length">
        {{ props.helperText }}
      </span>
    </div>
    <span class="text-sm text-red-700" v-if="errorMessage">
      {{ errorMessage }}
    </span>
  </div>
  <div v-else-if="fileType === 'video'">
    <div v-if="!url?.length">
      <label
        class="dark:hover:bg-bray-800 flex h-24 max-w-[130px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat text-center hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <span class="whitespace-nowrap">
          {{ props.label || "Upload File" }}
        </span>
        <input class="hidden" type="file" @change="handleFileChange" :multiple="multiple" :accept="accept" />
      </label>
      <span class="text-sm text-gray-500" v-if="props?.helperText?.length">
        {{ props.helperText }}
      </span>
    </div>

    <div v-else>
      <label for="imageView">
        <video :class="class" :src="url" alt=""></video>
        <input class="hidden" type="file" @change="handleFileChange" :multiple="multiple" :accept="accept"
          id="imageView" />
      </label>
    </div>
    <span class="text-sm text-red-700" v-if="errorMessage">
      {{ errorMessage }}
    </span>
  </div>
  <p v-if="selectedFileName && showFilename"
    class="mt-2 max-w-[100%] text-wrap break-words break-all text-[12px] text-gray-600">
    {{ selectedFileName }}
  </p>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";

const props = withDefaults(
  defineProps<{
    label?: string;
    name: string;
    helperText?: string;
    placeholder?: string;
    required?: boolean;
    class?: string;
    validation?: boolean;
    accept?: string;
    multiple?: boolean;
    showFilename?: boolean;
    fileType: String;
    url: any;
  }>(),
  {
    label: "",
    helperText: "",
    placeholder: "",
    required: false,
    disabled: false,
    class: "",
    validation: true,
    accept: "",
    multiple: false,
    showFilename: true,
    url: "",
    fileType: "file",
  },
);


const selectedFileName = ref("");

const replacedId = ref(props.label ?? props.name);
let { value, errorMessage }: { value: any; errorMessage: any } =
  !props.validation
    ? { value: props?.name, errorMessage: "" }
    : useField(() => props.name);

if (value?.value?.file?.name) {
  selectedFileName.value = value?.value?.file.name;
}

const emit = defineEmits(["change"]);
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (target.files && target.files.length > 0) {
    const files = Array.from(target.files);
    selectedFileName.value = files?.map((file) => file.name).join(",");
    value.value = target.files;
  } else {
    selectedFileName.value = "";
    value.value = target.files;
  }
  // Validate file size
  const file = target.files[0]
  const fileSizeInMB = file.size / (1024 * 1024)
  const MAX_FILE_SIZE_MB = file.type.startsWith('image/') ? 5 : 100;
  // Validate file size
  if (fileSizeInMB > MAX_FILE_SIZE_MB) {
    toast.error(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit. Your file is ${fileSizeInMB.toFixed(2)} MB.`);
    selectedFileName.value = "";
    return
  }
  emit("change", target.files);
};
</script>
