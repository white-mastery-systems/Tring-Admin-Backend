<template>
  <div>
    <label
      class="dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
      <div v-if="isLoading" class="grid h-[90vh] place-items-center text-[#424BD1]">
        <Icon name="svg-spinners:90-ring-with-bg" class="h-8 w-8" />
      </div>
      <span v-else>
        Upload file
      </span>
      <input class="hidden" type="file" @change="handleFileChange" :multiple="multiple" :accept="accept" />
    </label>
    <span class="font-medium text-xs text-red-500" v-if="errorMessage">
      {{ errorMessage }}
    </span>
  </div>
  <p v-if="selectedFileName && showFilename"
    class="mt-2 max-w-[100%] text-wrap break-words break-all text-sm text-gray-600">
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
      isLoading: boolean;
    }>(),
    {
      label: "",
      helperText: "",
      placeholder: "",
      required: false,
      disabled: false,
      class: "",
      validation: true,
      accept: "audio/wav",
      multiple: false,
      showFilename:true,
      isLoading: false,
    },
  );

  const selectedFileName = ref("");

  const replacedId = ref(props.label ?? props.name);
  let { value, errorMessage }: { value: any; errorMessage: any } =
    !props.validation
      ? { value: props?.name, errorMessage: "" }
      : useField(() => props.name);

  if (value?.value?.name) {
    selectedFileName.value = value?.value.name;
  }




  const emit = defineEmits(["change"]);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const files = Array.from(target.files);
      const invalidFiles = files.filter(file => file.type !== "audio/wav");

          if (invalidFiles.length > 0) {
            // Show an error message if invalid files are uploaded
            toast.error('Only .wav files are allowed.')
            return;
          }

      selectedFileName.value = files?.map((file) => file.name).join(",");
      value.value = target.files;
    } else {
      selectedFileName.value = '';
      value.value = target.files
    }
      emit("change", target.files);
  };


// const handleFileChange = (e: Event) => {
//   const target = e.target as HTMLInputElement;
//   if (target.files && target.files.length > 0) {
//     const files = Array.from(target.files);

//     // Validate files to ensure they are .wav files
//     const invalidFiles = files.filter(file => file.type !== "audio/wav");

//     if (invalidFiles.length > 0) {
//       // Show an error message if invalid files are uploaded
//       errorMessage.value = "Only .wav files are allowed.";
//       return;
//     }

//     selectedFileName.value = files.map((file) => file.name).join(",");
//     value.value = target.files;
//     errorMessage.value = ""; // Reset error message if the file is valid
//   } else {
//     selectedFileName.value = "";
//     value.value = target.files;
//     errorMessage.value = "";
//   }

//   emit("change", target.files);
// };
</script>
