<template>
  <div>
    <label
      class="dark:hover:bg-bray-800 flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      Upload file
      <input
        class="hidden"
        type="file"
        @change="handleFileChange"
        :multiple="multiple"
        :accept="accept"
      />
    </label>
    <span class="text-sm text-red-700" v-if="errorMessage">
      {{ errorMessage }}
    </span>
  </div>
  <p
    v-if="selectedFileName"
    class="mt-2 max-w-[100%] text-wrap break-words break-all text-sm text-gray-600"
  >
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
      validation: Boolean;
      accept?: string;
      multiple?: boolean;
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
    },
  );

  const selectedFileName = ref("");

  const replacedId = ref(props.label ?? props.name);
  let { value, errorMessage }: { value: any; errorMessage: any } =
    !props.validation
      ? { value: props.name, errorMessage: "" }
      : useField(() => props.name);

  if (value?.value.name) {
    selectedFileName.value = value?.value.name;
  }

  watch(errorMessage, (newErr) => {});

  watch(value, (newValue) => {});

  const emit = defineEmits(["change"]);
  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const files = Array.from(target.files);
      selectedFileName.value = files?.map((file) => file.name).join(",");
      // setFieldValue("file", Array.from(target.files));
      value.value = target.files;
      emit("change", target.files);
    } else {
      selectedFileName.value = null;
      value.value = target.files;
      emit("change", target.files);
    }
  };
</script>
