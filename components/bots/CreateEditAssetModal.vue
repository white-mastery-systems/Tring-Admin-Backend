<template>
  <DialogWrapper
    v-model="modalState"
    :title="modalState?.id ? `Edit Assets` : 'Add Assets'"
  >
    <UiForm @submit="handleFormSubmission">
      <div>
        <label
          class="grid h-24 w-24 items-center rounded-sm bg-gray-200 text-center"
        >
          Upload file
          <input class="hidden" type="file" @change="handleFileChange" />
        </label>
        <span class="text-sm text-red-700" v-if="errors.file">
          {{ errors.file }}
        </span>
      </div>
      <p v-if="selectedFileName" class="mt-2 text-sm text-gray-600">
        {{ selectedFileName }}
      </p>

      <UiFormField v-model="nameField" v-bind="nameFieldAttrs" name="name">
        <UiFormItem class="w-full">
          <UiFormLabel>
            Intent Name <UiLabel class="text-lg text-red-700">*</UiLabel>
          </UiFormLabel>
          <UiFormControl>
            <UiInput
              :class="errors.name ? 'border-red-700' : ''"
              type="text"
              v-model="nameField"
              v-bind="nameFieldAttrs"
              placeholder="Eg:Amenties"
            />
          </UiFormControl>
          <p v-if="errors.name" class="mt-0 text-sm text-red-700">
            {{ errors.name }}
          </p>
          <span class="text-xs text-gray-500"
            >Enter a unique name to identify the intent</span
          >
        </UiFormItem>
      </UiFormField>
      <div class="flex w-full justify-end">
        <UiButton class="" color="primary" type="submit">Submit</UiButton>
      </div>
    </UiForm>
  </DialogWrapper>
</template>
<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { useForm } from "vee-validate";
  import { ref } from "vue";
  import { assetsValidation } from "~/validationSchema/assetValidation";

  const { handleSubmit, defineField, errors, setFieldValue, values } = useForm({
    validationSchema: toTypedSchema(assetsValidation),
  });
  watch(values, (value) => {});
  const modalState = defineModel<{ open: boolean; id: string | null }>({
      default: { open: false, id: null },
      required: true,
    });
  const [nameField, nameFieldAttrs] = defineField("name");
  const fileRef = ref<File | null>(null);
  const selectedFileName = ref<string | null>(null);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      fileRef.value = file;
      selectedFileName.value = file.name;
      setFieldValue("file", target.files);
    } else {
      fileRef.value = null;
      selectedFileName.value = null;
      setFieldValue("file", null);
    }
  };

  const handleFormSubmission = handleSubmit((values) => {
    if (!modalState.value.id) {
      const formData = new FormData();
      formData.append("name", values.name);
      if (fileRef.value) {
        formData.append("file", fileRef.value);
      }

      $fetch("/api/bots/", {
        method: "POST",
        body: formData,
      });
    }
    return true;
  });
</script>
